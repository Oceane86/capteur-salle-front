// app/not-found.tsx
import "@styles/NotFound.scss";

const NotFound = () => {
  return (
    <>
      <div className="not-found">
        <h1>Page non trouvée</h1>
        <p>La page que vous cherchez n'existe pas ou a été déplacée.</p>
        <a className="btn mt-3" href="/">Retour à l'accueil</a>
      </div>
    </>
  );
};

export default NotFound;
