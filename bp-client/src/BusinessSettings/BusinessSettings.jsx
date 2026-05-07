import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthContext } from "../Providers/AuthProvider";
import "./BusinessSettings.css";
import ProductCard from "../components/ProductCard/ProductCard";
import { ProductForm } from "../components/ProductForm/ProductForm";
import { BusinessForm } from "../components/BusinessForm/BusinessForm";
import { useAuthorization } from "../useAuthorization";
import { toast } from "react-toastify";
import Loading from "../components/Loading/Loading";
import EmptyState from "../components/EmptyState/EmptyState";
import { Button } from "../components/Button/Button";
import { ConfirmModal } from "../components/ConfirmModal/ConfirmModal";

export const BusinessSettings = () => {
  const { id } = useParams();
  const businessId = id;
  const navigate = useNavigate();
  const [state] = useAuthContext();
  const [activeTab, setActiveTab] = useState("profile");
  const [categories, setCategories] = useState([]);
  const [originalBusinessData, setOriginalBusinessData] = useState(null);
  const [serverErrors, setServerErrors] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState(null);
  const { checkAccess } = useAuthorization();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  const daysOrder = useMemo(
    () => [
      "Pondělí",
      "Úterý",
      "Středa",
      "Čtvrtek",
      "Pátek",
      "Sobota",
      "Neděle",
    ],
    []
  );

  const userId =
    state.profile?.[
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
    ] || state.profile?.sub;

  const categoryOptions = useMemo(
    () => [
      { value: "", label: "Vyberte kategorii..." },
      ...categories.map((c) => ({ value: c.id, label: c.name })),
    ],
    [categories]
  );

  useEffect(() => {
    const loadDetail = async () => {
      try {
        const [businessRes, categoriesRes, hoursRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/Businesses/${businessId}`),
          axios.get(`${API_BASE_URL}/Categories`),
          axios.get(`${API_BASE_URL}/OpeningHours/business/${businessId}`),
        ]);
        const isOk = checkAccess(businessRes.data, userId, "business");
        if (!isOk) return;
        const sortedHours = hoursRes.data.sort(
          (a, b) => daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day)
        );
        const b = businessRes.data;
        setOriginalBusinessData({
          ...b,
          ICO: b.ico,
          openingHours: sortedHours,
        });
        setCategories(categoriesRes.data);
      } catch (err) {
        console.error("Chyba při načítání dat:", err);
        navigate("/pristup-odmitnut");
      } finally {
        setLoading(false);
      }
    };
    if (businessId) loadDetail();
  }, [businessId, userId, navigate, daysOrder, API_BASE_URL]);

  const fetchBusinessProducts = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/Products/business/${businessId}`
      );
      setProducts(response.data);
    } catch (err) {
      setError("Nepodařilo se načíst produkty");
    }
  };

  useEffect(() => {
    if (businessId) fetchBusinessProducts();
  }, [businessId, API_BASE_URL]);
  const onUpdateBusiness = async (formData) => {
    setServerErrors([]);
    try {
      const businessPayload = {
        ...originalBusinessData,
        ...formData,
        ico: formData.ICO,
      };
      await axios.put(
        `${API_BASE_URL}/Businesses/${businessId}`,
        businessPayload,
        {
          headers: { Authorization: `Bearer ${state.accessToken}` },
        }
      );
      const hoursPayload = formData.openingHours.map((oh) => ({
        ...oh,
        businessId: Number(businessId),
        isClosed: oh.isClosed,
        start: oh.isClosed ? "00:00" : oh.start,
        end: oh.isClosed ? "00:00" : oh.end,
      }));
      await axios.put(`${API_BASE_URL}/OpeningHours/bulk`, hoursPayload, {
        headers: { Authorization: `Bearer ${state.accessToken}` },
      });
      toast.success("Podnik byl úspěšně aktualizován")
    } catch (error) {
      toast.error("Podnik se nepodařilo aktualizovat")
      setServerErrors(["Nepodařilo se uložit změny podniku"]);
    }
  };

  const handleExportCSV = async (businessId, token) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/Products/${businessId}/export-csv`, 
            {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob', 
            }
        );
        const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `produkty_export.csv`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
        toast.success("CSV soubor byl úspěšně stažen");
    } catch (error) {
        console.error("Export error:", error);
        toast.error("Nepodařilo se vygenerovat soubor");
    }
  };

  const onAddProduct = async (data) => {
    setServerErrors([]);
    try {
      let catId = data.categoryId;
      if (data.isNewCategory && data.newCategoryName) {
        const catRes = await axios.post(
          `${API_BASE_URL}/Categories`,
          { Name: data.newCategoryName },
          { headers: { Authorization: `Bearer ${state.accessToken}` } }
        );
        catId = catRes.data.id;
        setCategories((prev) => [...prev, catRes.data]);
      }
      if (!catId) {
            setServerErrors(["Prosím vyberte nebo zadejte kategorii"]);
            return false;
      }
      const productPayload = {
        Name: data.nameProduct,
        Info: data.infoProduct,
        Price: Number(data.price),
        ImageURL: data.imageProductURL,
        CategoryId: Number(catId),
        BusinessId: Number(businessId),
      };
      const productRes = await axios.post(
        `${API_BASE_URL}/Products`,
        productPayload,
        {
          headers: { Authorization: `Bearer ${state.accessToken}` },
        }
      );
      if (data.tips && data.tips.length > 0) {
        const tipsPromises = data.tips
          .filter((t) => t.text || t.nameTip)
          .map((t) =>
            axios.post(
              `${API_BASE_URL}/Tips`,
              {
                Name: t.nameTip,
                Info: t.text,
                ProductId: productRes.data.id,
                CategoryId: Number(catId),
              },
              { headers: { Authorization: `Bearer ${state.accessToken}` } }
            )
          );
        await Promise.all(tipsPromises);
      }
      toast.success("Produkt byl úspěšně uložen");
      navigate("/sortiment")
      fetchBusinessProducts();
      return true;
    } catch (error) {
      setServerErrors([error.response?.data || error.message]);
      return false;
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/Products/${id}`, {
        headers: { Authorization: `Bearer ${state.accessToken}` },
      });
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Produkt byl úspěšně smazán");
    } catch (err) {
      toast.error("Smazání se nepodařilo");
    }
  };

  const openDeleteModal = (pid) => {
    setProductToDelete(pid); 
    setIsModalOpen(true);    
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      await handleDeleteProduct(productToDelete); 
      setIsModalOpen(false);
      setProductToDelete(null);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="business-settings-page">
      <ConfirmModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title="Smazat produkt?"
        message="Opravdu chcete tento produkt trvale odstranit?"
      />
      <h1 className="settings-page-title">Správa podniku</h1>
      <div className="tabs-navigation">
        <button
          className={`tab-btn ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          Informace o podniku
        </button>
        <button
          className={`tab-btn ${activeTab === "add-products" ? "active" : ""}`}
          onClick={() => setActiveTab("add-products")}
        >
          Přidat produkt
        </button>
        <button
          className={`tab-btn ${activeTab === "products" ? "active" : ""}`}
          onClick={() => setActiveTab("products")}
        >
          Spravovat produkty
        </button>
      </div>
      <div className="tab-content">
        {activeTab === "profile" && originalBusinessData && (
          <div className="business-header-edit fade-in">
            <h2>Nastavení profilu podniku</h2>
            <BusinessForm
              onSubmit={onUpdateBusiness}
              accessToken={state.accessToken}
              initialData={originalBusinessData}
            />
          </div>
        )}
        {activeTab === "add-products" && (
          <div className="business-flex-form-container fade-in">
            <h2>Přidat nový produkt do nabídky</h2>
            <ProductForm
              onSubmit={onAddProduct}
              categoryOptions={categoryOptions}
              serverErrors={serverErrors}
            />
          </div>
        )}
        {activeTab === "products" && (
          <div className="products-list-section">
            {products.length > 0 ? (
              <>
                <div className="section-header-flex">
                  <h2>Seznam produktů</h2>
                  </div>
                  <div className="bussiness-products-action">
                    <Button text="Stáhnout soubor s produkty ve formátu CSV" onClick={() => handleExportCSV(id, state.accessToken)}/>                
                  </div>
                <div className="products-grid">
                  {products.map((p) => (
                    <ProductCard
                      key={p.id}
                      image={p.imageURL}
                      name={p.name}
                      id={p.id}
                      price={p.price}
                      category={p.category?.name}
                      isOwner={true}
                      onDelete={() => openDeleteModal(p.id)}                      
                      onUpdate={() => navigate(`/upravit-produkt/${p.id}`)}
                      product={p}
                    />
                  ))}
                </div>
              </>
            ) : (
              <EmptyState message="zkuste přidat nový produkt" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};