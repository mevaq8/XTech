import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-[#0F172A]">
      {/* Premium topographic texture — dense thin flowing organic contour lines, dark-on-dark ~6% opacity */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.13 }}
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="topoWaves" x="0" y="0" width="1200" height="800" patternUnits="userSpaceOnUse">
            {/* Layer A — broad slow sweeping waves */}
            <path d="M-100,60 C100,20 300,100 500,55 C700,10 900,90 1100,45 C1200,22 1250,35 1350,20" fill="none" stroke="#94a3b8" strokeWidth="0.4" />
            <path d="M-100,95 C150,50 350,135 550,88 C750,42 950,118 1150,75 C1230,58 1280,70 1350,55" fill="none" stroke="#94a3b8" strokeWidth="0.3" />
            <path d="M-100,130 C120,82 330,168 530,118 C730,72 930,148 1130,102 C1220,82 1270,95 1350,82" fill="none" stroke="#94a3b8" strokeWidth="0.4" />
            <path d="M-100,168 C180,115 380,205 580,152 C780,100 980,180 1180,135 C1245,112 1290,128 1350,115" fill="none" stroke="#94a3b8" strokeWidth="0.28" />
            <path d="M-100,205 C200,148 400,240 600,188 C800,136 1000,218 1200,170 C1265,148 1305,162 1350,150" fill="none" stroke="#94a3b8" strokeWidth="0.38" />
            <path d="M-100,245 C160,185 370,275 570,222 C770,170 970,255 1170,205 C1238,182 1288,198 1350,185" fill="none" stroke="#94a3b8" strokeWidth="0.28" />
            <path d="M-100,285 C220,220 420,315 620,260 C820,205 1020,290 1220,240 C1280,218 1310,235 1350,222" fill="none" stroke="#94a3b8" strokeWidth="0.4" />
            <path d="M-100,328 C190,258 390,355 590,298 C790,242 990,330 1190,278 C1252,255 1300,272 1350,260" fill="none" stroke="#94a3b8" strokeWidth="0.3" />
            <path d="M-100,368 C240,295 440,395 640,335 C840,278 1040,368 1240,315 C1295,292 1318,308 1350,298" fill="none" stroke="#94a3b8" strokeWidth="0.38" />
            <path d="M-100,410 C210,335 415,435 615,375 C815,318 1015,408 1215,355 C1272,332 1312,348 1350,336" fill="none" stroke="#94a3b8" strokeWidth="0.28" />
            <path d="M-100,452 C260,372 455,478 655,415 C855,358 1055,450 1255,395 C1305,372 1322,388 1350,375" fill="none" stroke="#94a3b8" strokeWidth="0.4" />
            <path d="M-100,495 C230,412 440,518 640,455 C840,395 1040,492 1240,435 C1292,412 1320,428 1350,415" fill="none" stroke="#94a3b8" strokeWidth="0.3" />
            <path d="M-100,538 C280,452 478,558 678,495 C878,435 1078,532 1278,475 C1318,452 1330,468 1350,455" fill="none" stroke="#94a3b8" strokeWidth="0.36" />
            <path d="M-100,582 C250,492 460,598 660,535 C860,475 1060,572 1260,515 C1308,492 1325,508 1350,495" fill="none" stroke="#94a3b8" strokeWidth="0.28" />
            <path d="M-100,625 C310,535 505,642 705,578 C905,515 1105,615 1305,555 C1330,532 1338,548 1350,538" fill="none" stroke="#94a3b8" strokeWidth="0.4" />
            <path d="M-100,668 C280,572 490,682 690,618 C890,555 1090,658 1290,595 C1325,572 1335,588 1350,578" fill="none" stroke="#94a3b8" strokeWidth="0.3" />
            <path d="M-100,712 C330,615 522,725 722,660 C922,595 1122,700 1322,638 C1340,612 1345,628 1350,618" fill="none" stroke="#94a3b8" strokeWidth="0.36" />
            <path d="M-100,755 C300,652 508,768 708,702 C908,638 1108,742 1308,678 C1338,652 1342,668 1350,658" fill="none" stroke="#94a3b8" strokeWidth="0.28" />
            {/* Layer B — tighter secondary contours between layer A lines */}
            <path d="M-100,42 C130,8 310,68 510,36 C710,2 910,60 1110,28 C1210,10 1265,22 1350,10" fill="none" stroke="#cbd5e1" strokeWidth="0.22" />
            <path d="M-100,112 C165,68 355,148 555,102 C755,58 955,132 1155,88 C1228,68 1275,80 1350,68" fill="none" stroke="#cbd5e1" strokeWidth="0.22" />
            <path d="M-100,148 C200,98 398,185 598,135 C798,85 998,162 1198,118 C1258,98 1280,112 1350,100" fill="none" stroke="#cbd5e1" strokeWidth="0.2" />
            <path d="M-100,225 C170,162 372,258 572,205 C772,152 972,238 1172,188 C1242,162 1282,178 1350,165" fill="none" stroke="#cbd5e1" strokeWidth="0.22" />
            <path d="M-100,265 C225,198 418,298 618,242 C818,188 1018,272 1218,222 C1265,198 1295,215 1350,202" fill="none" stroke="#cbd5e1" strokeWidth="0.2" />
            <path d="M-100,308 C205,240 405,335 605,280 C805,225 1005,310 1205,258 C1258,235 1292,252 1350,240" fill="none" stroke="#cbd5e1" strokeWidth="0.22" />
            <path d="M-100,348 C248,278 442,375 642,318 C842,262 1042,348 1242,295 C1280,272 1308,290 1350,278" fill="none" stroke="#cbd5e1" strokeWidth="0.2" />
            <path d="M-100,390 C228,318 428,415 628,356 C828,298 1028,388 1228,335 C1272,312 1305,328 1350,318" fill="none" stroke="#cbd5e1" strokeWidth="0.22" />
            <path d="M-100,432 C270,355 465,456 665,395 C865,338 1065,428 1265,375 C1288,352 1315,368 1350,356" fill="none" stroke="#cbd5e1" strokeWidth="0.2" />
            <path d="M-100,474 C248,395 450,496 650,435 C850,376 1050,470 1250,415 C1280,392 1318,408 1350,396" fill="none" stroke="#cbd5e1" strokeWidth="0.22" />
            <path d="M-100,516 C268,432 462,538 662,475 C862,415 1062,510 1262,455 C1295,432 1322,448 1350,436" fill="none" stroke="#cbd5e1" strokeWidth="0.2" />
            <path d="M-100,558 C298,472 492,578 692,515 C892,455 1092,552 1292,495 C1312,472 1328,488 1350,476" fill="none" stroke="#cbd5e1" strokeWidth="0.22" />
            <path d="M-100,602 C268,515 468,618 668,555 C868,495 1068,592 1268,535 C1305,512 1330,528 1350,518" fill="none" stroke="#cbd5e1" strokeWidth="0.2" />
            <path d="M-100,645 C318,555 512,660 712,596 C912,535 1112,635 1312,576 C1328,552 1338,568 1350,558" fill="none" stroke="#cbd5e1" strokeWidth="0.22" />
            <path d="M-100,688 C298,598 498,702 698,638 C898,576 1098,678 1298,618 C1320,594 1336,610 1350,598" fill="none" stroke="#cbd5e1" strokeWidth="0.2" />
            <path d="M-100,732 C348,642 540,748 740,682 C940,618 1140,720 1340,658 C1348,634 1350,650 1350,638" fill="none" stroke="#cbd5e1" strokeWidth="0.22" />
            <path d="M-100,776 C318,682 518,788 718,722 C918,658 1118,762 1318,698 C1340,675 1348,690 1350,680" fill="none" stroke="#cbd5e1" strokeWidth="0.2" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#topoWaves)" />
      </svg>
      <div className="absolute bottom-0 inset-x-0 h-10 pointer-events-none bg-gradient-to-b from-transparent to-[#F8FAFC]/30" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="font-sora font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white leading-tight tracking-tight mb-6">
            Bakıda Noutbuk, Printer və İT Avadanlıqları{" "}
            <span className="text-accent">| XTech</span>
          </h1>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="font-inter text-base sm:text-lg text-slate-300/90 leading-relaxed max-w-2xl mx-auto mb-10"
        >
          Oyun, iş və ev istifadəsi üçün ən sərfəli modelləri XTech-də tapın. Bütün məhsullar 100% qarantiya ilə təqdim olunur və sifariş WhatsApp üzərindən sürətli şəkildə həyata keçirilir.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/#products"
            className="px-8 py-3.5 bg-accent text-white font-inter font-medium rounded-xl hover:bg-[#16A34A] hover:shadow-[0_0_30px_rgba(34,197,94,0.35)] transition-all duration-300 active:scale-[0.97]"
          >
            Məhsullara bax
          </Link>
          <Link
            to="/#features"
            className="px-8 py-3.5 border border-white/20 text-white font-inter font-medium rounded-xl hover:bg-white/10 transition-all duration-300 active:scale-[0.97]"
          >
            Kəşf et
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
