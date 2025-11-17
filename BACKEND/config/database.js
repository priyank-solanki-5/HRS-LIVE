import mongoose from "mongoose";

export async function connectToDatabase() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("MONGO_URI is not set. Please add it to your .env file.");
    process.exit(1);
  }
  try {
    await mongoose.connect(mongoUri, {
      // Fail fast if cluster is not reachable (e.g., IP not allowed)
      serverSelectionTimeoutMS: 10000,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);

    // Provide actionable troubleshooting hints for common Atlas connection issues
    try {
      // Attempt to determine the machine's public IP to help with Atlas IP access list
      const res = await fetch("https://api.ipify.org?format=json", {
        method: "GET",
        timeout: 3000,
      });
      if (res.ok) {
        const j = await res.json();
        console.error(`It looks like your public IP is: ${j.ip}`);
        console.error(
          "If you are using MongoDB Atlas, add this IP to the Atlas Network Access (IP Access List)."
        );
      }
    } catch (e) {
      // ignore failures to fetch public IP
    }

    console.error("Common fixes:");
    console.error(
      "- Add your current public IP to the Atlas IP Access List: https://www.mongodb.com/docs/atlas/security-whitelist/"
    );
    console.error(
      "- For development you can temporarily allow all IPs (0.0.0.0/0) but this is NOT recommended for production."
    );
    console.error(
      "- Verify the connection string (MONGO_URI) in your .env: correct username, password, and optional default database."
    );
    console.error(
      "- Ensure your network or corporate firewall allows outbound connections to MongoDB Atlas (DNS/SRV and TLS)."
    );
    console.error(
      "- Test the same connection string in MongoDB Compass to get more detailed error information."
    );

    process.exit(1);
  }
}
