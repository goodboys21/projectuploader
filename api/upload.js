export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const formData = new FormData();
        const file = req.body;
        formData.append("file", file);

        const uploadResponse = await fetch("https://cdn.acaw.my.id/upload", {
            method: "POST",
            body: formData
        });

        const uploadData = await uploadResponse.json();

        if (!uploadData.fileDetails || !uploadData.fileDetails.fileName) {
            return res.status(500).json({ message: "Gagal upload ke CDN Acaw" });
        }

        // Modifikasi URL agar menggunakan domain Vercel
        const fileName = uploadData.fileDetails.fileName;
        const proxyUrl = `https://baguscdn.vercel.app/file/${fileName}`;

        res.json({
            fileName: fileName,
            fileUrl: proxyUrl,
            message: "File uploaded successfully via proxy"
        });

    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
    }
}
