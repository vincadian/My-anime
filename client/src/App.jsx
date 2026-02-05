import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { Link } from "react-router-dom";


import './App.css'

function App() {

  const { id, user_id } = useParams(); 

  // ===== STATE =====
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  

  // ===== FETCH DATA =====
  const fetchAnimes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/anime/${id}`);
      
      if (!response.ok) {
        throw new Error('Erreur serveur');
      }
      
      const data = await response.json();
      setAnimes(data);
      setError(null);
    } catch (err) {
      setError('Impossible de charger les animés. Le serveur est-il lancé ?');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ===== EFFECT : Charger au démarrage =====
    useEffect(() => {
      if (id) fetchAnimes();
    }, [id]);

  //delete function
  const deleteAnime = async (animeId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/anime/delete/${animeId}/${id}`,
        {
          method: "DELETE"
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      // Mise à jour locale de la liste
      setAnimes(prev => prev.filter(a => a.id !== animeId));

    } catch (error) {
      console.error("Erreur suppression :", error);
    }
  };



  // ===== RENDER =====
  return (
  <div className="container" style={{padding: '10px'}}>

    <h1>🎌 Mon Top 10 Animés</h1>
    <p>Gérez votre classement personnel</p>

    {/* État de chargement */}
    {loading && (
      <p>⏳ Chargement...</p>
    )}

    {/* Erreur */}
    {error && (
      <div>
        <p>❌ {error}</p>
        <button onClick={fetchAnimes}>Réessayer</button>
      </div>
    )}

    {/* Liste des animés */}
    {!loading && !error && (
      <div className="anime-list" style={{ display: 'flex', gap: '10px'}}>
        {animes.length === 0 ? (
          <p>Aucun animé dans la liste</p>
        ) : (
          animes.map((anime) => (
            <div key={anime.id} className="anime-card" style={{backgroundColor: '#f0f0f0', padding: '5px', borderRadius: '5px', color: '#333'}}>


              <p>Titre: {anime.title}</p>
              <p>Commentaire: {anime.commentaire}</p>
              <p>Rang: {anime.rang}</p>
              <div style={{display: 'flex', gap: '10px'}}> 
                <Link to={`/anime/update/${id}/${anime.id}`}>
                  <button>Modifier</button>
                </Link>
                <button onClick={() => deleteAnime(anime.id)}>
                Supprimer
                </button>

              </div>
              
              
              
              
            </div>

          ))
        )}
      </div>
      
    )}

    <p>Total : {animes.length} animés</p>
    <Link to={`/anime/post/${id}`}>
      <button>Ajouter un animé</button>
    </Link>
  </div>
);
}
export default App