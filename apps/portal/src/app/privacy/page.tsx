import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#050608] text-gray-300 py-24 px-6 font-sans">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-blue-500 hover:text-blue-400 mb-8 inline-block">
          &larr; Volver al inicio
        </Link>
        <h1 className="text-4xl font-black text-white mb-8">Política de Privacidad</h1>
        
        <div className="space-y-6 leading-relaxed text-gray-400">
          <p>
            <strong>Última actualización: Agosto 2026</strong>
          </p>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Información que recopilamos</h2>
          <p>
            Al utilizar este sitio web o contactarnos a través de nuestros formularios, podemos recopilar la siguiente información:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Nombre completo</li>
            <li>Dirección de correo electrónico</li>
            <li>Información sobre tu proyecto o mensaje</li>
            <li>Datos de uso anónimos a través de herramientas de analítica web (Google Analytics).</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Uso de la información</h2>
          <p>
            La información recopilada se utiliza exclusivamente para:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Responder a tus consultas de desarrollo de software, colaboraciones o propuestas.</li>
            <li>Mejorar la experiencia de usuario en nuestro sitio web.</li>
            <li>Cumplir con las políticas de Google AdSense en nuestros subdominios.</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Terceros y Google AdSense</h2>
          <p>
            En algunos de nuestros subdominios utilizamos Google AdSense para mostrar anuncios. Google utiliza cookies (como la cookie de DoubleClick) para publicar anuncios basados en tus visitas anteriores a este y otros sitios web.
            Puedes inhabilitar el uso de cookies para publicidad basada en intereses visitando la Configuración de anuncios de Google.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Seguridad de tus datos</h2>
          <p>
            Implementamos medidas de seguridad para proteger tu información personal. Tus datos de contacto no serán vendidos, intercambiados ni transferidos a terceros sin tu consentimiento, excepto cuando sea necesario para cumplir con la ley.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. Contacto</h2>
          <p>
            Si tienes alguna pregunta sobre esta Política de Privacidad, puedes contactarnos en: 
            <a href="mailto:achataipepercy@gmail.com" className="text-blue-500 ml-2">achataipepercy@gmail.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}
