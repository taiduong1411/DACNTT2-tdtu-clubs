import axios from "axios";
const upload = async (file, folder, onUploadProgress) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "tdtu_clubs");
    data.append('folder', folder);

    try {
        const res = await axios.post(
            "https://api.cloudinary.com/v1_1/dljdvysp7/image/upload",
            data, {
            onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                onUploadProgress(percentCompleted);
            }
        });

        const { url, public_id } = res.data;
        return { url, public_id };
    } catch (err) {
        console.log(err);
    }
};

export default upload;