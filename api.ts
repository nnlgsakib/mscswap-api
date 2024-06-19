import express from "express";
import cors from "cors";
import { ethers } from "ethers";
import { CONTRACT, ABI } from "./contract";

const app = express();
const port = 3000;

app.use(cors());

const provider = new ethers.WebSocketProvider("wss://seednode.mindchain.info/ws");

async function getReserve() {
    const contract = new ethers.Contract(CONTRACT, ABI, provider);
    try {
        const reserves = await contract.getReserves();
        const reserve0:any = ethers.formatEther(reserves._reserve0);
        const reserve1:any = ethers.formatEther(reserves._reserve1);
        const in_usd = reserve0 / reserve1;
        return in_usd.toString(); 
    } catch (error) {
        console.error("Error fetching reserves:", error);
        throw new Error("Failed to fetch reserves");
    }
}

app.get("/price", async (req, res) => {
    try {
        const price = (await getReserve()).slice(0, 5);
        res.json({ price });
    } catch (error:any) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
