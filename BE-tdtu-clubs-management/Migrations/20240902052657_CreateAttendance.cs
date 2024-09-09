using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BEtdtuclubsmanagement.Migrations
{
    /// <inheritdoc />
    public partial class CreateAttendance : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Attendances",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ClubId = table.Column<int>(name: "Club_Id", type: "int", nullable: false),
                    SchedulesId = table.Column<int>(name: "Schedules_Id", type: "int", nullable: false),
                    StudentId = table.Column<string>(name: "Student_Id", type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Attendances", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Attendances");
        }
    }
}
