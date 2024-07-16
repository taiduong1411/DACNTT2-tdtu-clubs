using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BEtdtuclubsmanagement.Migrations
{
    /// <inheritdoc />
    public partial class UpdateMailTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Type",
                table: "Mails",
                newName: "Image");

            migrationBuilder.AddColumn<bool>(
                name: "IsReceiverHidden",
                table: "Mails",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsSenderHidden",
                table: "Mails",
                type: "bit",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsReceiverHidden",
                table: "Mails");

            migrationBuilder.DropColumn(
                name: "IsSenderHidden",
                table: "Mails");

            migrationBuilder.RenameColumn(
                name: "Image",
                table: "Mails",
                newName: "Type");
        }
    }
}
