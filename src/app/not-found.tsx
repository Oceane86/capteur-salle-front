// app/not-found.tsx

const NotFound = () => {
  return (
    <>
      <title>Erreur 404 | Digital Campus</title>
      <meta name="description" content="Erreur 404" />
      
      <div className="not-found">
        <h1>Page non trouvée</h1>
        <p>La page que vous cherchez n'existe pas ou a été déplacée.</p>
        <a className="btn mt-3" href="/">Retour à l'accueil</a>
      </div>
    </>
  );
};

export default NotFound;
