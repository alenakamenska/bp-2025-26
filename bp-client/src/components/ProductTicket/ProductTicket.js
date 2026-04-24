import React, { useRef } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import IconButton from "../iconButton";
import { CiSaveDown1 } from "react-icons/ci";

export const ProductTicket = ({ product }) => {
  const labelRef = useRef();

  const handleDownloadPDF = async () => {
    const element = labelRef.current;
    const canvas = await html2canvas(element, { scale: 3 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [60, 100],
    });
    pdf.addImage(imgData, "PNG", 0, 0, 60, 100);
    pdf.save(`etiketa-${product.name}.pdf`);
  };

  return (
    <div>
      <IconButton 
        icon={CiSaveDown1}
        onClick={handleDownloadPDF} 
        color="#bc6c25"
        width={50}
      />
      <div style={{ position: "absolute", left: "-9999px" }}>
        <div 
          ref={labelRef} 
          className="label-template"
          style={{
            width: "60mm",
            height: "100mm",
            padding: "5mm",
            backgroundColor: "#ffffff",
            color: "#283618", 
            fontFamily: "sans-serif",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            border: "1px solid #ade8b8"
          }}
        >
          <div style={{ textAlign: "center", borderBottom: "2px solid #bc6c25" }}>
            <h2 style={{ margin: "5px 0", fontSize: "18pt" }}>{product.name}</h2>
          </div>
          <div style={{ flexGrow: 1, padding: "5mm 0", fontSize: "10pt" }}>
            <p><strong>Cena:</strong> {product.price} Kč</p>
            <div style={{ marginTop: "10px", fontStyle: "italic", fontSize: "9pt" }}>
                {product.info && product.info.substring(0, 450) + "..."}
            </div>
          </div>
          <div style={{ textAlign: "center", fontSize: "8pt", color: "#bc6c25" }}>
            <p>Děkujeme za nákup!</p>
          </div>
        </div>
      </div>
    </div>
  );
};