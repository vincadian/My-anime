import express from "express";
import cors from "cors";
const app = express();
const PORT = 3000;
import { pool } from "./db.js";

// Middleware pour parser le JSON
app.use(express.json());

// Middleware CORS
app.use(cors());


app.get("/anime/:id", async (req, res) => {

  const { id } = req.params;
  try {
    const result = await pool.query(`
    SELECT a.*, u.username, an.title,an.id
    FROM user_anime_ratings AS a
    JOIN users AS u ON u.id = a.user_id
    JOIN animes AS an ON an.id = a.anime_id
    WHERE u.id = $1

    `,[id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.post("/anime/:user_id", async (req, res) => {
  const { title, rang, note } = req.body;
  const { user_id } = req.params;
  

  try { 
    const insertAnime = await pool.query(
        `INSERT INTO animes (title) VALUES ($1) RETURNING id`,
        [title]
    )
    const anime_id = insertAnime.rows[0].id;

    const insertRating =  await pool.query(
        `INSERT INTO user_anime_ratings (user_id, anime_id, rang, note) VALUES ($1, $2, $3, $4) RETURNING *`,
        [user_id, anime_id, rang, note]
    );
    res.json(insertRating.rows[0]);



  }catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});


app.delete("/anime/delete/:id/:user_id", async (req, res) => {
    const { id, user_id } = req.params;
    try {
        const deleteAnime = await pool.query(
            `DELETE FROM animes WHERE id = $1 RETURNING *`,
            [id]
        );
        res.json(deleteAnime.rows[0]);
        
        const deleteRating = await pool.query(
            `DELETE FROM user_anime_ratings WHERE anime_id = $1 AND user_id = $2 RETURNING *`,
            [id, user_id]
        );
        res.json(deleteRating.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
    })

app.put("/anime/update/:user_id", async (req, res) => {
    const { title, rang, note, anime_id } = req.body;
    const { user_id } = req.params;

    try { 
        const updateAnime = await pool.query(
            `UPDATE animes SET title = $1 WHERE id = $2 RETURNING *`,
            [title, anime_id]
        );
        res.json(updateAnime.rows[0]);

        const updateRating =  await pool.query(
            `UPDATE user_anime_ratings SET rang = $1, note = $2 WHERE user_id = $3 AND anime_id = $4 RETURNING *`,
            [rang, note, user_id, anime_id]
        );
        res.json(updateRating.rows[0]);


    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
