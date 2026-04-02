using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace bp_api.Migrations
{
    /// <inheritdoc />
    public partial class cascadeDelete : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tips_Products_ProductId",
                table: "Tips");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "11111111-1111-1111-1111-111111111111",
                column: "ConcurrencyStamp",
                value: "ff2579ac-9fee-45f3-afa9-558358e9e8c8");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "22222222-2222-2222-2222-222222222222",
                column: "ConcurrencyStamp",
                value: "831fc21c-3d4e-4a73-b702-74412e0f81c1");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "33333333-3333-3333-3333-333333333333",
                column: "ConcurrencyStamp",
                value: "31803c3b-3bc5-4a1c-8413-17abd78eaa2f");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "9f930254-6851-41aa-96d4-dfb401f7470d", "AQAAAAIAAYagAAAAEJnYQIU8U9VWFVrGSJbIvWlHONdXBxcTnsemhEM7TV6JM8R/w7y4CBJPPzEQ7DBKuw==", "5e90e961-651b-4ea3-b48f-ecdb9729c2d1" });

            migrationBuilder.AddForeignKey(
                name: "FK_Tips_Products_ProductId",
                table: "Tips",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tips_Products_ProductId",
                table: "Tips");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "11111111-1111-1111-1111-111111111111",
                column: "ConcurrencyStamp",
                value: "c450a9d7-068f-436c-a559-9b3a6e6af657");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "22222222-2222-2222-2222-222222222222",
                column: "ConcurrencyStamp",
                value: "a4d4479b-7eed-4a86-8a3e-2a2f61357031");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "33333333-3333-3333-3333-333333333333",
                column: "ConcurrencyStamp",
                value: "ea7c07d5-97d7-4f36-bf52-821b7b2a07a9");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "1d0474b1-e865-4397-a86f-3c886466b308", "AQAAAAIAAYagAAAAENmLXS96EQR5+SZNqGlMJVRRqjH8c555326oj2RWj7OLg3oi7SwPEAFU4U20AczxsA==", "3d116897-6183-449f-aaa0-128ef5868b73" });

            migrationBuilder.AddForeignKey(
                name: "FK_Tips_Products_ProductId",
                table: "Tips",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "Id");
        }
    }
}
