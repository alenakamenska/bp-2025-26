using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace bp_api.Migrations
{
    /// <inheritdoc />
    public partial class OwnerId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "OwnerId",
                table: "Businesses",
                type: "text",
                nullable: false,
                defaultValue: "");

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
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OwnerId",
                table: "Businesses");

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
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "3aac4de5-adf2-42a5-96b7-b0cb927b3655", "AQAAAAIAAYagAAAAEP4/2PkeGVxdjoeN8qwxrlGfUXTvj68hNN1EBt3uuheeYF80ndvbl/CkgbYfcnwQKQ==", "8e5541dc-33a1-4205-8a2d-889256d05de5" });
        }
    }
}
