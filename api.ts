import express from "express";
import cors from "cors";
import { ethers } from "ethers";
import { CONTRACT, ABI, CONTRACT_1 } from "./contract";

const app = express();
const port = 3001;

app.use(cors());

const provider = new ethers.JsonRpcProvider("https://seednode.mindchain.info/");

async function getReserve(con:any){
    const contract = new ethers.Contract(con, ABI, provider);
    try {
        const reserves = await contract.getReserves();
        const reserve0:any = ethers.formatEther(reserves._reserve0);
        const reserve1:any = ethers.formatEther(reserves._reserve1);
        const in_usd = reserve1 / reserve0;
        return in_usd.toString() + " USD"; 
    } catch (error) {
        console.error("Error fetching reserves:", error);
        throw new Error("Failed to fetch reserves");
    }
}

app.get("/price/mind", async (req, res) => {
    try {
        const price = (await getReserve(CONTRACT)).slice(0, 5);
        res.json({ price });
    } catch (error:any) {
        res.status(500).json({ error: error.message });
    }
});
app.get("/price/musd", async (req, res) => {
    try {
        const price = (await getReserve(CONTRACT_1)).slice(0, 5);
        res.json({ price });
    } catch (error:any) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
