import React from 'react';
import './blog.css'; // Importamos el CSS para esta página

// Puedes añadir una imagen de cabecera para el blog si quieres
// import blogHeaderImage from '../assets/blog-header.jpg';

function BlogPage() {
  return (
    <main className="blog-container">
      <div className="blog-post">

        {/* <img src={blogHeaderImage} alt="Blog de VicTec" className="blog-post-image" /> */}
        
        <h1 className="blog-post-title">
          ¡Bienvenidos a VicTec! Más que una Tienda, un Proyecto Chileno.
        </h1>

        <p className="blog-post-meta">
          Publicado el 3 de Noviembre, 2025 | Por Equipo VicTec
        </p>

        <div className="blog-post-content">
          <p>
            ¡Hola a todos y bienvenidos al blog de VicTec!
          </p>
          <p>
            Estamos increíblemente emocionados de lanzar este proyecto. Para nosotros, 
            VicTec no es solo otra tienda de tecnología en línea. Es la culminación 
            de una pasión personal y un sueño: crear un espacio <strong>hecho por 
            y para los entusiastas de la tecnología en Chile.</strong>
          </p>
          
          <h2>Nuestra Misión: Innovación Curada</h2>
          <p>
            Vivimos en un mundo donde la tecnología avanza a pasos agigantados. 
            Cada día aparecen nuevos gadgets, nuevos audífonos, nuevos accesorios 
            que prometen hacernos la vida más fácil o más entretenida. Pero, 
            ¿cuántos de ellos realmente valen la pena?
          </p>
          <p>
            Nuestra misión es ser tu filtro. Como desarrollador y fanático de la 
            tecnología, mi compromiso es buscar, probar y "curar" solo aquellos 
            productos que son genuinamente innovadores y que ofrecen un valor real. 
            No queremos venderte *todo*; queremos ofrecerte *lo mejor* de lo que 
            hemos encontrado.
          </p>

          <h2>Un Proyecto Chileno con Identidad Propia</h2>
          <p>
            VicTec nace en Chile, con el orgullo de ser una marca personal que 
            busca darse a conocer. No somos una corporación gigante; somos un equipo 
            pequeño (¡por ahora!) apasionado por lo que hace. Esto nos da una 
            ventaja única: podemos escucharte. 
          </p>
          <p>
            Este blog será nuestro canal de comunicación directo contigo. Aquí no 
            solo hablaremos de nuestros productos; hablaremos de tendencias, 
            daremos tutoriales, compartiremos noticias del mundo tech y, lo más 
            importante, construiremos una comunidad.
          </p>
          <p>
            Gracias por acompañarnos desde el día uno. Esto recién comienza.
          </p>
          <p>
            - Vicente, Fundador de VicTec.
          </p>
        </div>
      </div>
    </main>
  );
}

export default BlogPage;