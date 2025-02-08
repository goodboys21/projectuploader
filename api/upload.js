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
            headers: {
                "accept": "application/json"
            },
            body: formData
        });

        if (!uploadResponse.ok) {
            return res.status(500).json({ message: "Gagal upload ke CDN Acaw" });
        }

        const uploadData = await uploadResponse.json();

        if (!uploadData.fileDetails || !uploadData.fileDetails.fileName) {
            return res.status(500).json({ message: "Upload gagal, cek server!" });
        }

        // Ganti URL file dengan proxy domain lu
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
