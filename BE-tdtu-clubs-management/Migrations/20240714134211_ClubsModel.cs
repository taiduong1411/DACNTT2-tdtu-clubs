using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BEtdtuclubsmanagement.Migrations
{
    /// <inheritdoc />
    public partial class ClubsModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Clubs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Clubname = table.Column<string>(name: "Club_name", type: "nvarchar(max)", nullable: true),
                    Clubdescription = table.Column<string>(name: "Club_description", type: "nvarchar(max)", nullable: true),
                    ManagerId = table.Column<string>(name: "Manager_Id", type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ImgUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PublicId = table.Column<string>(name: "Public_Id", type: "nvarchar(max)", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Clubs", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Clubs");
        }
    }
}
