using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace bp_api.Migrations
{
    /// <inheritdoc />
    public partial class Update : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CategoryId",
                table: "Tips",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsClosed",
                table: "OpeningHours",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "ICO",
                table: "Businesses",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "IsVerified",
                table: "Businesses",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "PrivacyPolicyAcceptedAt",
                table: "AspNetUsers",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "11111111-1111-1111-1111-111111111111",
                column: "ConcurrencyStamp",
                value: "ba1f8526-e6d1-496b-bd2c-0dac3c88fe20");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "22222222-2222-2222-2222-222222222222",
                column: "ConcurrencyStamp",
                value: "35e914c0-9c32-467f-a1c4-63d059725aba");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "33333333-3333-3333-3333-333333333333",
                column: "ConcurrencyStamp",
                value: "556ca9e0-0741-431f-a31e-91e49774627d");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "PrivacyPolicyAcceptedAt", "SecurityStamp" },
                values: new object[] { "3aac4de5-adf2-42a5-96b7-b0cb927b3655", "AQAAAAIAAYagAAAAEP4/2PkeGVxdjoeN8qwxrlGfUXTvj68hNN1EBt3uuheeYF80ndvbl/CkgbYfcnwQKQ==", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "8e5541dc-33a1-4205-8a2d-889256d05de5" });

            migrationBuilder.CreateIndex(
                name: "IX_Tips_CategoryId",
                table: "Tips",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Tips_UserId",
                table: "Tips",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Tips_AspNetUsers_UserId",
                table: "Tips",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Tips_Categories_CategoryId",
                table: "Tips",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tips_AspNetUsers_UserId",
                table: "Tips");

            migrationBuilder.DropForeignKey(
                name: "FK_Tips_Categories_CategoryId",
                table: "Tips");

            migrationBuilder.DropIndex(
                name: "IX_Tips_CategoryId",
                table: "Tips");

            migrationBuilder.DropIndex(
                name: "IX_Tips_UserId",
                table: "Tips");

            migrationBuilder.DropColumn(
                name: "CategoryId",
                table: "Tips");

            migrationBuilder.DropColumn(
                name: "IsClosed",
                table: "OpeningHours");

            migrationBuilder.DropColumn(
                name: "ICO",
                table: "Businesses");

            migrationBuilder.DropColumn(
                name: "IsVerified",
                table: "Businesses");

            migrationBuilder.DropColumn(
                name: "PrivacyPolicyAcceptedAt",
                table: "AspNetUsers");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "11111111-1111-1111-1111-111111111111",
                column: "ConcurrencyStamp",
                value: "d7c1fba5-0870-4d69-9d74-eb718742b00e");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "22222222-2222-2222-2222-222222222222",
                column: "ConcurrencyStamp",
                value: "0656fd2b-5a45-43d4-a544-4c7364a3a822");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "33333333-3333-3333-3333-333333333333",
                column: "ConcurrencyStamp",
                value: "132225b5-f808-4d83-b832-d82f9d35def7");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "9b7962a4-6800-4c6c-a436-9d2d9f00cf4e", "AQAAAAIAAYagAAAAEItGDJJ3JLd4VYEr0ESHyA2lbwRJ+P6zdC2IOZjeXN5aUi7N1cvaKOY7Gr4mgTtk1w==", "00896de5-1558-4fe3-b2ec-1179290fc94b" });
        }
    }
}
