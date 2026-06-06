// Mock news database for offline development

const categoryImages = {
  technology: [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop'
  ],
  business: [
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1542744094-3a31f103e35f?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1491336477066-31156b5e4f35?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1579532562111-3de21b0d24db?w=800&auto=format&fit=crop'
  ],
  sports: [
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1531415080290-bc9b00dac0ab?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519766304817-4f37bda74a27?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1565992441121-4367c2967103?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1547941126-3d5323b218e6?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop'
  ],
  entertainment: [
    'https://images.unsplash.com/photo-1499364619118-29928580153f?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1460881680858-30d872d5b530?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=800&auto=format&fit=crop'
  ],
  health: [
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1606166325012-904ff7299d4e?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop'
  ],
  science: [
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1530210120071-ec4d1a1350b9?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1564325724739-bae0bd08762c?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1554475901-4538ddfbccc2?w=800&auto=format&fit=crop'
  ],
  politics: [
    'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1508962914676-134849a727f0?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1577412647305-991150c7d163?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507537362147-987ec35cd71e?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1521791136368-1a9b79c530a3?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1569025743873-ea3a9ae8a5a6?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1540910419-c914b4e470bc?w=800&auto=format&fit=crop'
  ],
  world: [
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1473163928189-364b2c4e1135?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop'
  ]
};

const mockArticles = [
  {
    source: { id: 'techcrunch', name: 'TechCrunch' },
    author: 'Sarah Perez',
    title: 'The Future of AI: Generative Models Take Over Next-Gen Mobile Devices',
    description: 'Tech giants are racing to integrate advanced generative AI architectures directly onto chipsets for instant offline translation, voice assistance, and image generation.',
    url: 'https://techcrunch.com/future-of-ai-mobile-devices',
    urlToImage: categoryImages.technology[1],
    publishedAt: '2026-06-06T11:00:00Z',
    content: 'The mobile ecosystem is experiencing an unprecedented shift as local device-based generative AI systems become standard. Tech giants are racing to integrate advanced generative AI architectures directly onto chipsets for instant offline translation, voice assistance, and image generation. With these updates, mobile speed and privacy are expected to increase exponentially...',
    category: 'technology',
    country: 'us'
  },
  {
    source: { id: 'the-verge', name: 'The Verge' },
    author: 'Rajveer-Zala',
    title: 'Apna News Launches Brand New Responsive MERN Stack Platform',
    description: 'Apna News is setting a new benchmark for digital journalism by offering real-time headlines, personalized category recommendations, and lightning-fast searches.',
    url: 'https://theverge.com/apna-news-mern-launch',
    urlToImage: categoryImages.technology[3],
    publishedAt: '2026-06-06T10:15:00Z',
    content: 'Apna News is setting a new benchmark for digital journalism by offering real-time headlines, personalized category recommendations, and lightning-fast searches. Utilizing a state-of-the-art MERN architecture, the service aims to cater to the modern reader who values readability and speed above all else...',
    category: 'technology',
    country: 'in'
  },
  {
    source: { id: 'bloomberg', name: 'Bloomberg' },
    author: 'Emily Chang',
    title: 'Global Markets Rally as Central Banks Hint at Easing Interest Rates',
    description: 'Financial markets saw a major surge today after major central banks hinted that inflation is stabilizing, indicating interest rate cuts may begin sooner than expected.',
    url: 'https://bloomberg.com/global-markets-rally-rates',
    urlToImage: categoryImages.business[1],
    publishedAt: '2026-06-06T09:30:00Z',
    content: 'Financial markets saw a major surge today after major central banks hinted that inflation is stabilizing, indicating interest rate cuts may begin sooner than expected. Investors responded enthusiastically, leading to record gains in major indexes across the US, UK, and European stock markets...',
    category: 'business',
    country: 'us'
  },
  {
    source: { id: 'moneycontrol', name: 'Moneycontrol' },
    author: 'Rohan Shah',
    title: 'India GDP Growth Exceeds Estimates: Climbs to 7.8% in Current Quarter',
    description: 'Strong performance in manufacturing, infrastructure, and services sectors drives India GDP to beat all economic projections for the second consecutive quarter.',
    url: 'https://moneycontrol.com/india-gdp-growth-7-8',
    urlToImage: categoryImages.business[2],
    publishedAt: '2026-06-06T08:45:00Z',
    content: 'Strong performance in manufacturing, infrastructure, and services sectors drives India GDP to beat all economic projections for the second consecutive quarter. Analysts point to increased digital public infrastructure and resilient domestic consumption as primary drivers...',
    category: 'business',
    country: 'in'
  },
  {
    source: { id: 'espn', name: 'ESPN' },
    author: 'Marcus Thompson',
    title: 'Championship Finals: Historic Double-Overtime Victory Seals the Title',
    description: 'In one of the most exciting finishes in sports history, a buzzer-beating three-pointer in double-overtime secure the championship cup for the underdogs.',
    url: 'https://espn.com/championship-finals-double-overtime',
    urlToImage: categoryImages.sports[1],
    publishedAt: '2026-06-06T07:15:00Z',
    content: 'In one of the most exciting finishes in sports history, a buzzer-beating three-pointer in double-overtime secure the championship cup for the underdogs. Fans were kept on the edge of their seats during the grueling game that saw lead changes over twenty-five times in the fourth quarter alone...',
    category: 'sports',
    country: 'us'
  },
  {
    source: { id: 'cricbuzz', name: 'Cricbuzz' },
    author: 'Harsha Bhogle',
    title: 'India Wins Thrilling T20 Match Against Australia in Final Over Drama',
    description: 'A spectacular display of death bowling and a composed half-century leads India to a 3-wicket victory in the final over of the T20 series opener.',
    url: 'https://cricbuzz.com/india-win-t20-australia-thriller',
    urlToImage: categoryImages.sports[2],
    publishedAt: '2026-06-06T06:00:00Z',
    content: 'A spectacular display of death bowling and a composed half-century leads India to a 3-wicket victory in the final over of the T20 series opener. Chasing a target of 188, the Indian top order struggled initially, but a strong middle-order partnership turned the game around...',
    category: 'sports',
    country: 'in'
  },
  {
    source: { id: 'hollywood-reporter', name: 'The Hollywood Reporter' },
    author: 'Rebecca Keegan',
    title: 'Indie Film Sweeps Major Awards at International Film Festival',
    description: 'A low-budget artistic masterpiece becomes the surprise winner of the night, securing Best Picture, Best Director, and Best Screenplay awards.',
    url: 'https://hollywoodreporter.com/indie-film-sweeps-awards',
    urlToImage: categoryImages.entertainment[1],
    publishedAt: '2026-06-06T05:20:00Z',
    content: 'A low-budget artistic masterpiece becomes the surprise winner of the night, securing Best Picture, Best Director, and Best Screenplay awards. Critics have hailed the film as a masterpiece of modern storytelling, capturing human connection in an increasingly digital world...',
    category: 'entertainment',
    country: 'us'
  },
  {
    source: { id: 'times-of-india', name: 'Times of India' },
    author: 'Ananya Sen',
    title: 'Bollywood Blockbuster Shatters Box Office Records Worldwide on Day One',
    description: 'The highly anticipated action drama breaks all initial opening records, collecting over 150 crores globally on its first day of release.',
    url: 'https://timesofindia.com/bollywood-blockbuster-box-office-records',
    urlToImage: categoryImages.entertainment[2],
    publishedAt: '2026-06-06T04:10:00Z',
    content: 'The highly anticipated action drama breaks all initial opening records, collecting over 150 crores globally on its first day of release. Long queues were seen outside theaters starting as early as 5:00 AM, with fans celebrating the return of their favorite actor to the silver screen...',
    category: 'entertainment',
    country: 'in'
  },
  {
    source: { id: 'nature', name: 'Nature Journal' },
    author: 'Dr. Elizabeth Blackwell',
    title: 'New CRISPR Breakthrough: Gene Editing Successfully Targets Hereditary Disease',
    description: 'Scientists have successfully edited a problematic genetic mutation in human trials, opening new pathways to permanently cure chronic hereditary illnesses.',
    url: 'https://nature.com/crispr-gene-editing-breakthrough',
    urlToImage: categoryImages.science[0],
    publishedAt: '2026-06-06T03:00:00Z',
    content: 'Scientists have successfully edited a problematic genetic mutation in human trials, opening new pathways to permanently cure chronic hereditary illnesses. The medical community is calling this a watershed moment for biotechnology, though ethical panels urge regulated frameworks going forward...',
    category: 'science',
    country: 'uk'
  },
  {
    source: { id: 'nasa', name: 'NASA Science' },
    author: 'James Webb Team',
    title: 'James Webb Telescope Detects Oceans of Water Vapor on Distant Exoplanet',
    description: 'The space telescope has detected strong atmospheric signatures of water vapor on a rocky exoplanet located 120 light-years away, hinting at habitable conditions.',
    url: 'https://nasa.gov/james-webb-detects-water-vapor-exoplanet',
    urlToImage: categoryImages.science[1],
    publishedAt: '2026-06-05T22:30:00Z',
    content: 'The space telescope has detected strong atmospheric signatures of water vapor on a rocky exoplanet located 120 light-years away, hinting at habitable conditions. Spectroscopic data reveals a thick atmosphere containing trace carbon dioxide and methane, raising hopes for biosignature search campaigns...',
    category: 'science',
    country: 'us'
  },
  {
    source: { id: 'bbc', name: 'BBC News' },
    author: 'Katya Adler',
    title: 'Climate Summit Agrees on Landmark Accord for Renewable Infrastructure Funding',
    description: 'Representatives from over 190 nations have signed an agreement to triple global renewable energy investments by 2030, focusing heavily on developing nations.',
    url: 'https://bbc.com/climate-summit-landmark-accord',
    urlToImage: categoryImages.world[1],
    publishedAt: '2026-06-05T20:15:00Z',
    content: 'Representatives from over 190 nations have signed an agreement to triple global renewable energy investments by 2030, focusing heavily on developing nations. The agreement outlines strict timelines for phasing down coal use and establishes a new multi-billion dollar green infrastructure fund...',
    category: 'world',
    country: 'gb'
  },
  {
    source: { id: 'reuters', name: 'Reuters' },
    author: 'Christian Lowe',
    title: 'Global Trade Corridors See Renewed Investment Amid Supply Chain Rebound',
    description: 'Maritime shipping and cargo corridors are receiving billions in upgrades as global distribution networks bounce back stronger and implement automated transit routes.',
    url: 'https://reuters.com/global-trade-corridors-investments',
    urlToImage: categoryImages.world[2],
    publishedAt: '2026-06-05T18:40:00Z',
    content: 'Maritime shipping and cargo corridors are receiving billions in upgrades as global distribution networks bounce back stronger and implement automated transit routes. Ports in major trade hubs are transitioning to AI-assisted logistics, reducing docking turnaround times by up to forty percent...',
    category: 'world',
    country: 'ca'
  },
  {
    source: { id: 'new-york-times', name: 'The New York Times' },
    author: 'David Leonhardt',
    title: 'Bipartisan Infrastructure Bill Passes in Senate: Billions Allocated for High-Speed Rail',
    description: 'In a rare display of bipartisanship, senators voted to approve a major public transit funding package that aims to connect five major regional hubs via modern bullet trains.',
    url: 'https://nytimes.com/senate-passes-bullet-train-bill',
    urlToImage: categoryImages.politics[2],
    publishedAt: '2026-06-05T16:30:00Z',
    content: 'In a rare display of bipartisanship, senators voted to approve a major public transit funding package that aims to connect five major regional hubs via modern bullet trains. The bill is expected to create hundreds of thousands of jobs and drastically reduce carbon emissions in key metropolitan corridors...',
    category: 'politics',
    country: 'us'
  },
  {
    source: { id: 'hindustan-times', name: 'Hindustan Times' },
    author: 'Priya Sharma',
    title: 'New Digital Governance Portal Launched to Streamline Citizen Services',
    description: 'The government launches a single-window portal enabling citizens to apply for documents, claim subsidies, and resolve grievances within 48 hours.',
    url: 'https://hindustantimes.com/digital-governance-citizen-portal',
    urlToImage: categoryImages.politics[3],
    publishedAt: '2026-06-05T14:20:00Z',
    content: 'The government launches a single-window portal enabling citizens to apply for documents, claim subsidies, and resolve grievances within 48 hours. The portal uses secure blockchain ledgers to prevent document tampering and ensure high transparency across state administrative departments...',
    category: 'politics',
    country: 'in'
  },
  {
    source: { id: 'lancet', name: 'The Lancet' },
    author: 'Dr. Sarah Jenkins',
    title: 'Global Health Report: Daily Exercise and Balanced Diet Cut Chronic Disease Risk by 40%',
    description: 'A 10-year longitudinal study involving over 100,000 participants confirms that moderate physical activity combined with clean eating dramatically improves longevity.',
    url: 'https://thelancet.com/global-health-study-longevity',
    urlToImage: categoryImages.health[1],
    publishedAt: '2026-06-05T12:00:00Z',
    content: 'A 10-year longitudinal study involving over 100,000 participants confirms that moderate physical activity combined with clean eating dramatically improves longevity. The study details how daily walking for 30 minutes combined with reduced intake of processed foods directly improves cardiovascular health...',
    category: 'health',
    country: 'ca'
  },
  {
    source: { id: 'healthline', name: 'Healthline' },
    author: 'Kelsey Costa',
    title: 'Mental Health in the Digital Age: Practical Ways to Detox from Social Media',
    description: 'Psychologists recommend structured "digital fasts" and offline hobbies to restore dopamine baseline levels and improve sleep patterns in teenagers.',
    url: 'https://healthline.com/mental-health-digital-detox-sleep',
    urlToImage: categoryImages.health[0],
    publishedAt: '2026-06-05T09:10:00Z',
    content: 'Psychologists recommend structured "digital fasts" and offline hobbies to restore dopamine baseline levels and improve sleep patterns in teenagers. Research shows that reducing screen time by just one hour before bed leads to deeper sleep cycles and increased focus throughout the day...',
    category: 'health',
    country: 'au'
  },
  {
    source: { id: 'spiegel', name: 'Der Spiegel' },
    author: 'Hans Meier',
    title: 'Germany Unveils Massive Solar Farm in Bavaria to Boost Green Grid Capacity',
    description: 'The solar installation is estimated to power over 250,000 homes annually, moving the country closer to its net-zero emissions timeline.',
    url: 'https://spiegel.de/germany-bavaria-solar-farm-net-zero',
    urlToImage: categoryImages.world[3],
    publishedAt: '2026-06-04T15:30:00Z',
    content: 'The solar installation is estimated to power over 250,000 homes annually, moving the country closer to its net-zero emissions timeline. Spanning over 500 hectares, the project features high-efficiency solar trackers and next-generation battery storage systems to deliver stable power grid output...',
    category: 'world',
    country: 'de'
  },
  {
    source: { id: 'le-monde', name: 'Le Monde' },
    author: 'Pierre Dupont',
    title: 'France Proposes New Culture Initiative Grant to Support Young Artists',
    description: 'A new arts grant will provide monthly financial assistance and free studio spaces to aspiring painters, writers, and performers under the age of 30.',
    url: 'https://lemonde.fr/france-culture-grant-young-artists',
    urlToImage: categoryImages.entertainment[3],
    publishedAt: '2026-06-04T12:00:00Z',
    content: 'A new arts grant will provide monthly financial assistance and free studio spaces to aspiring painters, writers, and performers under the age of 30. The Ministry of Culture stated that preserving creative talent is essential for cultural tourism and national identity in the post-pandemic era...',
    category: 'entertainment',
    country: 'fr'
  },
  {
    source: { id: 'asahi', name: 'Asahi Shimbun' },
    author: 'Kenji Sato',
    title: 'Japan Space Program Announces Lunar Rover Collaboration for Polar Exploration',
    description: 'A joint initiative between space agencies aims to deploy a lightweight rover to search for water ice deposits in deep crater shadows of the Moon south pole.',
    url: 'https://asahi.com/japan-space-program-lunar-rover',
    urlToImage: categoryImages.science[2],
    publishedAt: '2026-06-04T08:00:00Z',
    content: 'A joint initiative between space agencies aims to deploy a lightweight rover to search for water ice deposits in deep crater shadows of the Moon south pole. The rover will be equipped with specialized drills and spectrometers to analyze ice compositions and density under extreme subzero temperatures...',
    category: 'science',
    country: 'jp'
  }
];

// Generates fallback articles dynamically if a combination of category + country yields empty results
// This ensures that clicking any category-country combination always produces engaging content.
const generateDynamicArticles = (category, country, count = 5, existingArticles = []) => {
  const titles = [
    `Rising Trends in ${category.charAt(0).toUpperCase() + category.slice(1)}: What Experts Are Saying`,
    `How Global Shift is Shaping ${category.charAt(0).toUpperCase() + category.slice(1)} Today`,
    `A Deep Dive into the Latest ${category.charAt(0).toUpperCase() + category.slice(1)} Developments`,
    `The Economic Impact of ${category.charAt(0).toUpperCase() + category.slice(1)} on Local Communities`,
    `Future Outlook: What's Next for ${category.charAt(0).toUpperCase() + category.slice(1)} in the Coming Decades`,
    `Behind the Scenes: The Untold Story of ${category.charAt(0).toUpperCase() + category.slice(1)} Innovations`,
    `Key Challenges Facing the ${category.charAt(0).toUpperCase() + category.slice(1)} Industry This Year`,
    `How Digital Technology is Revolutionizing ${category.charAt(0).toUpperCase() + category.slice(1)}`,
    `The Rising Global Influence of Modern ${category.charAt(0).toUpperCase() + category.slice(1)}`,
    `Special Report: The New Era of ${category.charAt(0).toUpperCase() + category.slice(1)} in Developing Nations`
  ];
  
  const sources = [
    { id: 'apna-news-feed', name: 'Apna News Desk' },
    { id: 'global-press', name: 'Global Press' },
    { id: 'chronicle-today', name: 'Chronicle Today' }
  ];

  const authors = ['Aarav Patel', 'Jane Smith', 'David Jones', 'Yuki Tanaka', 'Marie Dubois'];

  const results = [];
  const images = [...(categoryImages[category] || categoryImages.world)];

  // Seeded deterministic shuffle of the images based on category + country
  const seedStr = `${category}-${country}`;
  let seed = 0;
  for (let sIdx = 0; sIdx < seedStr.length; sIdx++) {
    seed = seedStr.charCodeAt(sIdx) + ((seed << 5) - seed);
  }
  
  // Seeded LCG PRNG
  const random = () => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };
  
  // Shuffle
  for (let shuffleIdx = images.length - 1; shuffleIdx > 0; shuffleIdx--) {
    const j = Math.floor(random() * (shuffleIdx + 1));
    [images[shuffleIdx], images[j]] = [images[j], images[shuffleIdx]];
  }

  // Remove any images already used by existing/static articles on the page
  const usedImages = new Set(existingArticles.map(a => a.urlToImage).filter(Boolean));
  const availableImages = images.filter(img => !usedImages.has(img));
  const finalImagePool = availableImages.length > 0 ? availableImages : images;

  for (let i = 0; i < count; i++) {
    const publishedTime = new Date();
    publishedTime.setHours(publishedTime.getHours() - (i * 4 + 2)); // Subtract hours

    const titleText = titles[i % titles.length] + ` (Coverage in ${country.toUpperCase()})`;
    const urlToImage = finalImagePool[i % finalImagePool.length];

    results.push({
      source: sources[i % sources.length],
      author: authors[i % authors.length],
      title: titleText,
      description: `This is a featured report on the status of ${category} developments, showing localized trends and updates tailored for readers in ${country.toUpperCase()}.`,
      url: `https://apnanews.com/dynamic/${category}-${country}-${i}`,
      urlToImage: urlToImage,
      publishedAt: publishedTime.toISOString(),
      content: `In-depth analysis reveals how localized environments in ${country.toUpperCase()} are experiencing dynamic movements within the ${category} sector. Experts point out that regional policy adjustments combined with technological shifts are driving major changes that will impact local markets and consumers over the long term. Additional reviews are expected next quarter...`,
      category: category,
      country: country
    });
  }

  return results;
};

export const getMockNews = (category, country, search, sortBy) => {
  let filtered = [...mockArticles];

  // Apply filters
  if (category && category.toLowerCase() !== 'general') {
    filtered = filtered.filter(a => a.category.toLowerCase() === category.toLowerCase());
  }

  if (country) {
    filtered = filtered.filter(a => a.country.toLowerCase() === country.toLowerCase());
  }

  // If filtered is empty or too low, generate dynamic fallback articles so user always sees beautiful data
  if (filtered.length < 3 && category && country) {
    const dynamic = generateDynamicArticles(category.toLowerCase(), country.toLowerCase(), 6, filtered);
    filtered = [...filtered, ...dynamic];
  }

  // Apply search query
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(a => 
      (a.title && a.title.toLowerCase().includes(q)) || 
      (a.description && a.description.toLowerCase().includes(q)) ||
      (a.content && a.content.toLowerCase().includes(q)) ||
      (a.author && a.author.toLowerCase().includes(q))
    );
  }

  // Apply sorting
  if (sortBy === 'popularity') {
    // Mock sorting: just sort by title length as proxy
    filtered.sort((a, b) => b.title.length - a.title.length);
  } else if (sortBy === 'relevancy') {
    // Sort by content length as proxy for depth of article
    filtered.sort((a, b) => (b.content || '').length - (a.content || '').length);
  } else {
    // Default: Sort by date (latest first)
    filtered.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  }

  return filtered;
};
