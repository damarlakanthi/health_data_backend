import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());

let medData = [];

const fetchData = async () => {
  try {
    const response = await fetch("https://data.cdc.gov/resource/iw6q-r3ja.json");
    const data = await response.json();
    medData = data;
  } catch (err) {
    console.error("Error fetching data:", err);
  }
};

fetchData();

app.get("/", (req, res) => {
  res.send("There is nothing here");
});


app.get("/getMedicareData", (req, res) => {
  const filters = req.query;


  let filteredData = medData;

  if (Object.keys(filters).length > 0) {
    
    Object.keys(filters).forEach((key) => {
      filteredData = filteredData.filter((item) => {
        return item[key]?.toString().toLowerCase() === filters[key].toString().toLowerCase();
      });
    });
  }

  res.json(filteredData);
});


app.get("/getUniqueValues/:field", (req, res) => {
    const field = req.params.field;
    const dataKey = Object.keys(medData[0] || {}).find(k => k.toLowerCase() === field.toLowerCase());
    if (!dataKey) {
      return res.status(400).json({ error: `Field "${field}" not found in data` });
    }
    const uniqueValues = [...new Set(medData.map(item => item[dataKey]))];
    
    res.json(uniqueValues);
  });
  
  app.get("/getFields", (req, res) => {
    if (medData.length === 0) {
      return res.status(500).json({ error: "No data loaded" });
    }
    res.json(Object.keys(medData[0]));
  });

  

app.listen(3081, () => {
  console.log("Server is running on http://localhost:3081");
});
