using Microsoft.AspNetCore.SignalR;

namespace BE_tdtu_clubs_management.Hubs
{
    public class NotificationHub : Hub
    {
        public async Task SendNotification(int countMessage)
        {
            await Clients.All.SendAsync("newMessage", countMessage);
        }
        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
            Console.WriteLine("Client connected: " + Context.ConnectionId);
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            await base.OnDisconnectedAsync(exception);
            Console.WriteLine("Client disconnected: " + Context.ConnectionId);
        }
    }
}
