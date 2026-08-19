import Script from 'next/script';
import Image from 'next/image';

export default function DetailedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="index-page">
      {/* iPortfolio Vendor CSS Files */}
      <link href="/assets/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet" />
      <link href="/assets/vendor/bootstrap-icons/bootstrap-icons.css" rel="stylesheet" />
      <link href="/assets/vendor/aos/aos.css" rel="stylesheet" />
      <link href="/assets/vendor/glightbox/css/glightbox.min.css" rel="stylesheet" />
      <link href="/assets/vendor/swiper/swiper-bundle.min.css" rel="stylesheet" />
      
      {/* iPortfolio Main CSS File */}
      <link href="/assets/css/main.css" rel="stylesheet" />

      {/* iPortfolio Header (Sidebar) */}
      <header id="header" className="header dark-background d-flex flex-column">
        <i className="header-toggle d-xl-none bi bi-list"></i>

        <div className="profile-img">
          <Image src="/assets/img/my-profile-img.jpg" alt="ATP Dev Profile - Percy Acha" width={120} height={120} className="img-fluid rounded-circle" />
        </div>

        <a href="/" className="logo d-flex flex-column align-items-center justify-content-center text-center">
          <h1 className="sitename" style={{ fontSize: '28px' }}>Percy Acha</h1>
          <p className="text-white mt-1 mb-0" style={{ fontSize: '15px', fontWeight: '500' }}>
            <span className="d-block mb-1 text-info" style={{ fontSize: '13px', letterSpacing: '1px' }}>@ATPDEV</span>
            <span className="typed" data-typed-items="Software Developer, Mobile Expert, Tech Educator, Freelancer">Software Developer</span><span className="typed-cursor typed-cursor--blink" aria-hidden="true"></span>
          </p>
        </a>

        <div className="social-links text-center">
          <a href="#" className="twitter" aria-label="Twitter"><i className="bi bi-twitter-x"></i></a>
          <a href="#" className="facebook" aria-label="Facebook"><i className="bi bi-facebook"></i></a>
          <a href="#" className="instagram" aria-label="Instagram"><i className="bi bi-instagram"></i></a>
          <a href="#" className="google-plus" aria-label="Skype"><i className="bi bi-skype"></i></a>
          <a href="#" className="linkedin" aria-label="LinkedIn"><i className="bi bi-linkedin"></i></a>
        </div>

        <nav id="navmenu" className="navmenu">
          <ul>
            <li><a href="/" className="active"><i className="bi bi-house navicon"></i> Inicio</a></li>
            <li><a href="#about"><i className="bi bi-person navicon"></i> About</a></li>
            <li><a href="#resume"><i className="bi bi-file-earmark-text navicon"></i> Resume</a></li>
            <li><a href="#portfolio"><i className="bi bi-images navicon"></i> Portfolio</a></li>
            <li><a href="#services"><i className="bi bi-hdd-stack navicon"></i> Services</a></li>
            <li><a href="#contact"><i className="bi bi-envelope navicon"></i> Contact</a></li>
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      {children}

      {/* Footer */}
      <footer id="footer" className="footer position-relative light-background">
        <div className="container">
          <div className="copyright text-center">
            <p>© <span>Copyright</span> <strong className="px-1 sitename">iPortfolio</strong> <span>All Rights Reserved</span></p>
          </div>
          <div className="credits">
            Designed by <a href="https://bootstrapmade.com/">BootstrapMade</a>
          </div>
        </div>
      </footer>

      {/* Scroll Top */}
      <a href="#" id="scroll-top" className="scroll-top d-flex align-items-center justify-content-center" aria-label="Volver arriba"><i className="bi bi-arrow-up-short"></i></a>


      {/* Vendor JS Files */}
      <Script src="/assets/vendor/bootstrap/js/bootstrap.bundle.min.js" strategy="afterInteractive" />
      <Script src="/assets/vendor/php-email-form/validate.js" strategy="afterInteractive" />
      <Script src="/assets/vendor/aos/aos.js" strategy="afterInteractive" />
      <Script src="/assets/vendor/typed.js/typed.umd.js" strategy="afterInteractive" />
      <Script src="/assets/vendor/purecounter/purecounter_vanilla.js" strategy="afterInteractive" />
      <Script src="/assets/vendor/waypoints/noframework.waypoints.js" strategy="lazyOnload" />
      <Script src="/assets/vendor/glightbox/js/glightbox.min.js" strategy="lazyOnload" />
      <Script src="/assets/vendor/imagesloaded/imagesloaded.pkgd.min.js" strategy="lazyOnload" />
      <Script src="/assets/vendor/isotope-layout/isotope.pkgd.min.js" strategy="lazyOnload" />
      <Script src="/assets/vendor/swiper/swiper-bundle.min.js" strategy="lazyOnload" />

      {/* Main JS File */}
      <Script src="/assets/js/main.js" strategy="afterInteractive" />
    </div>
  );
}
