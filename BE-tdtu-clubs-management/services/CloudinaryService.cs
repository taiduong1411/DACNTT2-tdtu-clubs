using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;

public class CloudinaryService
{
    private readonly Cloudinary _cloudinary;

    public CloudinaryService(IConfiguration config)
    {
        var cloudinarySettings = config.GetSection("CloudinarySettings");
        var account = new Account(
            cloudinarySettings["CloudName"],
            cloudinarySettings["ApiKey"],
            cloudinarySettings["ApiSecret"]
        );

        _cloudinary = new Cloudinary(account);
    }

    public async Task<DeletionResult> DeleteImageAsync(string publicId)
    {
        var deletionParams = new DeletionParams(publicId);
        var result = await _cloudinary.DestroyAsync(deletionParams);
        return result;
    }
}
