import { Outlet, Article, SourcesConfig } from '../types';

export const DEFAULT_CONFIG: SourcesConfig = {
  keywords: [
    "parlimen",
    "parliament",
    "dewan rakyat",
    "dewan negara",
    "ahli parlimen",
    "hansard",
    "lower house",
    "upper house",
    "persidangan dewan",
    "soal jawab lisan",
    "kampar",
    "rang undang-undang"
  ],
  google_news_query: "(parlimen OR parliament OR \"dewan rakyat\" OR \"dewan negara\")",
  google_news_window: "14d",
  outlets: [
    {
      id: "parlimen",
      name: "Parlimen Malaysia",
      type: "Official",
      language: "BM/EN",
      domain: "parlimen.gov.my",
      feeds: []
    },
    {
      id: "rtm",
      name: "RTM",
      type: "Official",
      language: "BM/EN",
      domain: "berita.rtm.gov.my",
      feeds: []
    },
    {
      id: "bernama",
      name: "Bernama",
      type: "News agency / TV",
      language: "BM/EN",
      domain: "bernama.com",
      feeds: []
    },
    {
      id: "astroawani",
      name: "Astro Awani",
      type: "News agency / TV",
      language: "BM/EN",
      domain: "astroawani.com",
      feeds: []
    },
    {
      id: "thestar",
      name: "The Star",
      type: "Newspaper (English)",
      language: "EN",
      domain: "thestar.com.my",
      feeds: ["https://www.thestar.com.my/rss/News/Nation"]
    },
    {
      id: "nst",
      name: "New Straits Times",
      type: "Newspaper (English)",
      language: "EN",
      domain: "nst.com.my",
      feeds: []
    },
    {
      id: "malaymail",
      name: "Malay Mail",
      type: "Newspaper (English)",
      language: "EN",
      domain: "malaymail.com",
      feeds: ["https://www.malaymail.com/feed/rss/malaysia"]
    },
    {
      id: "fmt",
      name: "Free Malaysia Today",
      type: "Newspaper (English)",
      language: "EN",
      domain: "freemalaysiatoday.com",
      feeds: ["https://www.freemalaysiatoday.com/category/nation/feed/"]
    },
    {
      id: "malaysiakini",
      name: "Malaysiakini",
      type: "Newspaper (English)",
      language: "EN/BM",
      domain: "malaysiakini.com",
      feeds: []
    },
    {
      id: "theedge",
      name: "The Edge Malaysia",
      type: "Newspaper (English)",
      language: "EN",
      domain: "theedgemalaysia.com",
      feeds: []
    },
    {
      id: "bharian",
      name: "Berita Harian",
      type: "Newspaper (Malay)",
      language: "BM",
      domain: "bharian.com.my",
      feeds: []
    },
    {
      id: "utusan",
      name: "Utusan Malaysia",
      type: "Newspaper (Malay)",
      language: "BM",
      domain: "utusan.com.my",
      feeds: ["https://www.utusan.com.my/feed/"]
    },
    {
      id: "sinar",
      name: "Sinar Harian",
      type: "Newspaper (Malay)",
      language: "BM",
      domain: "sinarharian.com.my",
      feeds: []
    },
    {
      id: "hmetro",
      name: "Harian Metro",
      type: "Newspaper (Malay)",
      language: "BM",
      domain: "hmetro.com.my",
      feeds: []
    }
  ]
};

// Generate seed dates relative to current time so the 14-day trend and 'today' stats are consistently alive and accurate
const now = Date.now();
const hour = 3600 * 1000;
const day = 24 * hour;

export const INITIAL_ARTICLES: Article[] = [
  {
    id: "parl-001",
    title: "Dewan Rakyat lulus usul Rang Undang-Undang Perbekalan dengan undian suara majoriti",
    url: "https://www.parlimen.gov.my",
    snippet: "Persidangan Dewan Rakyat meluluskan bacaan kali kedua dan ketiga usul perbekalan setelah perbahasan peringkat jawatankuasa berlangsung selama empat hari secara tertib.",
    source_id: "parlimen",
    source: "Parlimen Malaysia",
    type: "Official",
    language: "BM/EN",
    published: new Date(now - 2 * hour).toISOString()
  },
  {
    id: "bernama-002",
    title: "Dewan Rakyat: Isu kos sara hidup dan subsidi bersasar tumpuan Waktu Pertanyaan Perdana Menteri",
    url: "https://www.bernama.com",
    snippet: "Kuala Lumpur: Langkah penstrukturan penyasaran subsidi petrol serta usaha menstabilkan bekalan harga barang keperluan asas menjadi agenda utama sesi Waktu Pertanyaan Perdana Menteri (PMQT) di Parlimen hari ini.",
    source_id: "bernama",
    source: "Bernama",
    type: "News agency / TV",
    language: "BM/EN",
    published: new Date(now - 4 * hour).toISOString()
  },
  {
    id: "star-003",
    title: "Parliament: Parliamentary Services Act bill to be tabled in upcoming Dewan Rakyat sitting",
    url: "https://www.thestar.com.my",
    snippet: "KUALA LUMPUR: Minister in the Prime Minister's Department confirmed the draft legislation ensuring parliamentary administrative independence has received cabinet approval and will be tabled soon.",
    source_id: "thestar",
    source: "The Star",
    type: "Newspaper (English)",
    language: "EN",
    published: new Date(now - 6 * hour).toISOString()
  },
  {
    id: "awani-004",
    title: "Sidang Dewan Negara bersambung: Senator perhalusi dasar peralihan tenaga dan keselamatan siber",
    url: "https://www.astroawani.com",
    snippet: "Persidangan Dewan Negara menumpukan perbahasan kepada Akta Keselamatan Siber dan persediaan prasarana kecerdasan buatan bagi melindungi kedaulatan digital negara.",
    source_id: "astroawani",
    source: "Astro Awani",
    type: "News agency / TV",
    language: "BM/EN",
    published: new Date(now - 10 * hour).toISOString()
  },
  {
    id: "fmt-005",
    title: "MPs call for bi-partisan select committee review on national healthcare financing model",
    url: "https://www.freemalaysiatoday.com",
    snippet: "Both government and opposition backbenchers urged Parliament to expand committee oversight to address public hospital doctor shortages and sustainable drug procurement schemes.",
    source_id: "fmt",
    source: "Free Malaysia Today",
    type: "Newspaper (English)",
    language: "EN",
    published: new Date(now - 14 * hour).toISOString()
  },
  {
    id: "bharian-006",
    title: "Dewan Rakyat kecoh seketika isu peruntukan kawasan Ahli Parlimen pembangkang",
    url: "https://www.bharian.com.my",
    snippet: "Dewan Rakyat hari ini hangat apabila Ahli Parlimen pembangkang membangkitkan syarat memorandum persefahaman bagi penyaluran dana kawasan Parlimen masing-masing.",
    source_id: "bharian",
    source: "Berita Harian",
    type: "Newspaper (Malay)",
    language: "BM",
    published: new Date(now - 18 * hour).toISOString()
  },
  {
    id: "rtm-007",
    title: "Parlimen: Hansard rasmi Dewan Rakyat kini boleh diakses dalam format digital interaktif",
    url: "https://berita.rtm.gov.my",
    snippet: "Pentadbiran Parlimen Malaysia memperkenalkan portal transkrip Hansard berkuasa carian semantik untuk kemudahan penyelidik, pengamal media dan masyarakat umum.",
    source_id: "rtm",
    source: "RTM",
    type: "Official",
    language: "BM/EN",
    published: new Date(now - 22 * hour).toISOString()
  },
  {
    id: "nst-008",
    title: "Dewan Rakyat passes amendment to Penal Code tightening penalties on cyberbullying offences",
    url: "https://www.nst.com.my",
    snippet: "Lawmakers in the Dewan Rakyat voted unanimously in favour of statutory updates penalising online stalking and malicious virtual harassment with severe deterrent custodial sentences.",
    source_id: "nst",
    source: "New Straits Times",
    type: "Newspaper (English)",
    language: "EN",
    published: new Date(now - 1 * day - 2 * hour).toISOString()
  },
  {
    id: "malaymail-009",
    title: "Speaker rules against unparliamentary language, reminds MPs of Standing Orders decorum",
    url: "https://www.malaymail.com",
    snippet: "Dewan Rakyat Speaker cautioned members against trading unverified allegations across the floor, urging strict adherence to Standing Order 36(6) during fiery question hour debates.",
    source_id: "malaymail",
    source: "Malay Mail",
    type: "Newspaper (English)",
    language: "EN",
    published: new Date(now - 1 * day - 5 * hour).toISOString()
  },
  {
    id: "sinar-010",
    title: "Ahli Parlimen gesa audit ketat projek tebatan banjir seluruh negara",
    url: "https://www.sinarharian.com.my",
    snippet: "Jawatankuasa Pilihan Khas Parlimen membentangkan laporan interim mengenai kesiapsiagaan monsun dan menuntut jadual kemajuan projek tebatan banjir dipercepatkan.",
    source_id: "sinar",
    source: "Sinar Harian",
    type: "Newspaper (Malay)",
    language: "BM",
    published: new Date(now - 1 * day - 9 * hour).toISOString()
  },
  {
    id: "theedge-011",
    title: "Fiscal Responsibility Act progress updates scrutinised by parliamentary finance committee",
    url: "https://theedgemalaysia.com",
    snippet: "Treasury officials briefed the Dewan Rakyat select committee on debt ceiling targets and medium-term revenue frameworks intended to narrow the federal budget deficit to 3.8%.",
    source_id: "theedge",
    source: "The Edge Malaysia",
    type: "Newspaper (English)",
    language: "EN",
    published: new Date(now - 2 * day - 3 * hour).toISOString()
  },
  {
    id: "utusan-012",
    title: "Dewan Negara lulus usul Rang Undang-Undang Lembaga Minyak Sawit Malaysia",
    url: "https://www.utusan.com.my",
    snippet: "Senator di Dewan Negara meluluskan pindaan bagi memperkukuh pematuhan piawaian pensijilan Minyak Sawit Mampan Malaysia (MSPO) bagi menembusi pasaran global bernilai tinggi.",
    source_id: "utusan",
    source: "Utusan Malaysia",
    type: "Newspaper (Malay)",
    language: "BM",
    published: new Date(now - 2 * day - 7 * hour).toISOString()
  },
  {
    id: "hmetro-013",
    title: "Parlimen dengar keluhan petani berkenaan subsidi baja dan benih padi sah",
    url: "https://www.hmetro.com.my",
    snippet: "Kementerian Pertanian dan Keterjaminan Makanan menjawab persoalan lisan di Dewan Rakyat berkaitan mekanisme pengedaran input pertanian di estet padi Kedah dan Perlis.",
    source_id: "hmetro",
    source: "Harian Metro",
    type: "Newspaper (Malay)",
    language: "BM",
    published: new Date(now - 2 * day - 11 * hour).toISOString()
  },
  {
    id: "mkini-014",
    title: "Dewan Rakyat to convene special debate on national food security resilience",
    url: "https://www.malaysiakini.com",
    snippet: "The lower house accepted an emergency motion under Standing Order 18(1) tabled to address agriculture productivity, climatic anomalies and domestic food supply reserves.",
    source_id: "malaysiakini",
    source: "Malaysiakini",
    type: "Newspaper (English)",
    language: "EN/BM",
    published: new Date(now - 3 * day - 1 * hour).toISOString()
  },
  {
    id: "bernama-015",
    title: "PAC Parlimen bentang dapatan audit pelaksanaan sistem pengurusan hospital pintar",
    url: "https://www.bernama.com",
    snippet: "Jawatankuasa Kira-Kira Wang Negara (PAC) mengemukakan enam syor pembetulan kepada Kementerian Kesihatan berhubung kelewatan integrasi rekod perubatan elektronik bersepadu.",
    source_id: "bernama",
    source: "Bernama",
    type: "News agency / TV",
    language: "BM/EN",
    published: new Date(now - 3 * day - 8 * hour).toISOString()
  },
  {
    id: "awani-016",
    title: "Isu skim persaraan skim perkhidmatan awam dibahaskan secara mendalam di Parlimen",
    url: "https://www.astroawani.com",
    snippet: "Perbahasan Dewan Rakyat menyentuh pertimbangan caruman KWSP menggantikan pencen konvensional bagi penjawat awam baharu demi kemampanan fiskal jangka panjang.",
    source_id: "astroawani",
    source: "Astro Awani",
    type: "News agency / TV",
    language: "BM/EN",
    published: new Date(now - 4 * day - 2 * hour).toISOString()
  },
  {
    id: "star-017",
    title: "Parliamentary caucus on renewable energy champions green tariff framework review",
    url: "https://www.thestar.com.my",
    snippet: "Multi-party MPs submitted a comprehensive memorandum proposing grid modernization investments and decentralized solar feed-in incentives for rural communities.",
    source_id: "thestar",
    source: "The Star",
    type: "Newspaper (English)",
    language: "EN",
    published: new Date(now - 4 * day - 6 * hour).toISOString()
  },
  {
    id: "bharian-018",
    title: "Menteri Kewangan beri penjelasan di Dewan Rakyat mengenai rizab antarabangsa Bank Negara",
    url: "https://www.bharian.com.my",
    snippet: "Kuala Lumpur: Kedudukan rizab rasmi antarabangsa negara kekal kukuh dan mencukupi untuk membiayai lebih lima bulan import barangan dan perkhidmatan, kata Menteri Kewangan II di Parlimen.",
    source_id: "bharian",
    source: "Berita Harian",
    type: "Newspaper (Malay)",
    language: "BM",
    published: new Date(now - 5 * day - 4 * hour).toISOString()
  },
  {
    id: "nst-019",
    title: "Select committee recommends whistleblower protections overhaul ahead of lower house sitting",
    url: "https://www.nst.com.my",
    snippet: "Parliamentary Special Select Committee on Governance, Integrity and Human Rights urged swift legislative amendments to protect civil service informants without administrative retaliation.",
    source_id: "nst",
    source: "New Straits Times",
    type: "Newspaper (English)",
    language: "EN",
    published: new Date(now - 5 * day - 9 * hour).toISOString()
  },
  {
    id: "fmt-020",
    title: "Dewan Rakyat: Transport Ministry details rail upgrading timelines for Gemas-JB double tracking",
    url: "https://www.freemalaysiatoday.com",
    snippet: "Answering oral questions in parliament, the Transport Minister outlined electrical testing milestones aiming for full commercial passenger service deployment next year.",
    source_id: "fmt",
    source: "Free Malaysia Today",
    type: "Newspaper (English)",
    language: "EN",
    published: new Date(now - 6 * day - 3 * hour).toISOString()
  },
  {
    id: "parl-021",
    title: "Pemberitahuan Usul Persidangan Mesyuarat Ketiga Dewan Rakyat Penggal Ketiga diterbitkan",
    url: "https://www.parlimen.gov.my",
    snippet: "Risalah rasmi urusan mesyuarat Dewan Rakyat memaparkan senarai rang undang-undang keutamaan kerajaan termasuk pindaan perlembagaan berkaitan had kewarganegaraan anak。",
    source_id: "parlimen",
    source: "Parlimen Malaysia",
    type: "Official",
    language: "BM/EN",
    published: new Date(now - 6 * day - 10 * hour).toISOString()
  },
  {
    id: "malaymail-022",
    title: "Dewan Negara unanimously endorses Mental Health Amendment Bill allowing paramedic intervention",
    url: "https://www.malaymail.com",
    snippet: "The Senate cleared decisive changes empowering certified crisis intervention teams to respond to psychological emergencies alongside law enforcement personnel.",
    source_id: "malaymail",
    source: "Malay Mail",
    type: "Newspaper (English)",
    language: "EN",
    published: new Date(now - 7 * day - 4 * hour).toISOString()
  },
  {
    id: "sinar-023",
    title: "PAC panggil wakil syarikat konsesi lebuh raya bagi siasatan kutipan tol",
    url: "https://www.sinarharian.com.my",
    snippet: "Pengerusi Jawatankuasa Kira-Kira Wang Negara (PAC) memaklumkan sesi keterangan saksi akan diadakan di bangunan Parlimen bagi merungkai perjanjian lanjutan konsesi lebuh raya.",
    source_id: "sinar",
    source: "Sinar Harian",
    type: "Newspaper (Malay)",
    language: "BM",
    published: new Date(now - 8 * day - 2 * hour).toISOString()
  },
  {
    id: "utusan-024",
    title: "Ahli Dewan Negara cadang skim insentif khas anak muda ceburi sektor pertanian moden",
    url: "https://www.utusan.com.my",
    snippet: "Sesi perbahasan petang di Dewan Negara menyaksikan cadangan pewujudan dana permulaan teknologi automasi pertanian pintar bagi mengurangkan kebergantungan buruh asing.",
    source_id: "utusan",
    source: "Utusan Malaysia",
    type: "Newspaper (Malay)",
    language: "BM",
    published: new Date(now - 9 * day - 5 * hour).toISOString()
  },
  {
    id: "theedge-025",
    title: "Parliament briefed on digital tax revenue collection trends from overseas tech giants",
    url: "https://theedgemalaysia.com",
    snippet: "Deputy Finance Minister presented revenue data showing steady growth in digital services tax collected from cross-border streaming platforms and software licensing.",
    source_id: "theedge",
    source: "The Edge Malaysia",
    type: "Newspaper (English)",
    language: "EN",
    published: new Date(now - 10 * day - 7 * hour).toISOString()
  },
  {
    id: "mkini-026",
    title: "Hansard reveals heated exchanges over local council election reform proposals in Dewan Rakyat",
    url: "https://www.malaysiakini.com",
    snippet: "The newly published Hansard transcript documented opposing arguments on grassroots municipal governance democratic mandates versus communal representation equity.",
    source_id: "malaysiakini",
    source: "Malaysiakini",
    type: "Newspaper (English)",
    language: "EN/BM",
    published: new Date(now - 11 * day - 4 * hour).toISOString()
  },
  {
    id: "rtm-027",
    title: "Siaran Langsung Dewan Rakyat: Liputan menyeluruh persidangan di saluran RTM dan Berita RTM",
    url: "https://berita.rtm.gov.my",
    snippet: "RTM meneruskan komitmen menyiarkan sesi persidangan Dewan Rakyat dan Dewan Negara secara langsung bagi memastikan ketelusan proses perundangan sampai ke rakyat.",
    source_id: "rtm",
    source: "RTM",
    type: "Official",
    language: "BM/EN",
    published: new Date(now - 12 * day - 6 * hour).toISOString()
  },
  {
    id: "hmetro-028",
    title: "Dewan Rakyat: Program jualan rahmah catat sambutan menggalakkan di kawasan luar bandar",
    url: "https://www.hmetro.com.my",
    snippet: "KPDN menjelaskan di Parlimen bahawa penambahan lokasi jualan bergerak Rahmah telah berjaya meringankan beban kos sara hidup lebih 2.4 juta isi rumah B40.",
    source_id: "hmetro",
    source: "Harian Metro",
    type: "Newspaper (Malay)",
    language: "BM",
    published: new Date(now - 13 * day - 3 * hour).toISOString()
  }
];
