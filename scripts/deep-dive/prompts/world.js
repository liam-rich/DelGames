// Curated prompt bank — geography and the world.

export default [
  {
    id: "european-country",
    text: "Name a country in Europe",
    answers:
      "france, germany, spain, italy, portugal, greece, netherlands|holland, belgium, luxembourg, switzerland, austria, poland, czech republic|czechia, slovakia, hungary, romania, bulgaria, croatia, slovenia, serbia, bosnia, montenegro, albania, north macedonia, kosovo, denmark, sweden, norway, finland, iceland, ireland, united kingdom|uk|britain, estonia, latvia, lithuania, belarus, ukraine, moldova, russia, turkey, cyprus, malta, monaco, andorra, liechtenstein, san marino, vatican city, georgia, armenia",
    bias: { france: 1.4, spain: 1.3, germany: 1.3, georgia: 0.15, turkey: 0.2, ireland: 1.1 },
  },
  {
    id: "african-country",
    text: "Name a country in Africa",
    answers:
      "egypt, nigeria, kenya, south africa, morocco, algeria, tunisia, libya, ethiopia, ghana, tanzania, uganda, zimbabwe, zambia, mozambique, angola, namibia, botswana, senegal, mali, niger, chad, sudan, south sudan, somalia, eritrea, djibouti, rwanda, burundi, cameroon, ivory coast|cote divoire|cote d ivoire, burkina faso, benin, togo, guinea, sierra leone, liberia, gambia, guinea bissau, mauritania, western sahara, congo, democratic republic of congo, gabon, equatorial guinea, central african republic, malawi, lesotho, eswatini|swaziland, madagascar, mauritius, seychelles, comoros, cape verde, sao tome and principe",
    bias: { egypt: 1.4, kenya: 1.3, "south africa": 1.4, chad: 0.1, niger: 0.3, guinea: 0.3, congo: 0.6 },
  },
  {
    id: "asian-country",
    text: "Name a country in Asia",
    answers:
      "china, japan, india, south korea, north korea, thailand, vietnam, indonesia, malaysia, singapore, philippines, cambodia, laos, myanmar|burma, bangladesh, pakistan, afghanistan, nepal, bhutan, sri lanka, maldives, mongolia, taiwan, iran, iraq, syria, lebanon, jordan, israel, saudi arabia, yemen, oman, united arab emirates|uae, qatar, bahrain, kuwait, kazakhstan, uzbekistan, turkmenistan, kyrgyzstan, tajikistan, azerbaijan, armenia, georgia, brunei, timor leste",
    bias: { china: 1.5, japan: 1.5, india: 1.4, georgia: 0.1, turkey: 0.2, jordan: 0.15, israel: 0.6 },
  },
  {
    id: "south-american-country",
    text: "Name a country in South America",
    answers:
      "brazil, argentina, chile, peru, colombia, venezuela, ecuador, bolivia, paraguay, uruguay, guyana, suriname, french guiana",
    bias: { brazil: 1.6, argentina: 1.4, chile: 1.2 },
  },
  {
    id: "island",
    text: "Name an island",
    answers:
      "sicily, sardinia, corsica, crete, cyprus, malta, ibiza, mallorca|majorca, menorca, tenerife, lanzarote, gran canaria, madeira, santorini, mykonos, rhodes, corfu, iceland, greenland, ireland, isle of man, isle of wight, jersey, guernsey, skye, orkney, shetland, anglesey, cuba, jamaica, barbados, trinidad, tobago, bahamas, bermuda, hawaii, maui, fiji, tahiti, bali, java, sumatra, borneo, sulawesi, java, phuket, sri lanka, maldives, madagascar, zanzibar, mauritius, seychelles, easter island, galapagos, falklands, tasmania, honshu, hokkaido, okinawa, sakhalin, svalbard, faroe islands, azores, canary islands, cape verde, saint lucia, antigua, grenada, curacao, aruba, martinique, guadeloupe, komodo, kos, lesbos, naxos, paros, capri, elba",
    bias: { hawaii: 1.2, ireland: 1.1, cuba: 1.1, sicily: 1.2, bali: 1.2, capri: 0.5 },
  },
  {
    id: "desert",
    text: "Name a desert",
    answers:
      "sahara, gobi, kalahari, namib, arabian, syrian, mojave, sonoran, chihuahuan, great basin, painted desert, death valley, atacama, patagonian, thar, karakum, kyzylkum, taklamakan, dasht e kavir, negev, sinai, simpson, great victoria, great sandy, gibson, tanami, nullarbor, antarctic, arctic, danakil, nubian, libyan, rub al khali|empty quarter, wadi rum, badlands, black rock, white sands, monument valley",
    bias: { sahara: 2, gobi: 1.4, "death valley": 0.5, negev: 0.4, sinai: 0.3 },
  },
  {
    id: "lake",
    text: "Name a lake",
    answers:
      "lake victoria, lake superior, lake michigan, lake huron, lake erie, lake ontario, loch ness, loch lomond, windermere, lake district, lake geneva, lake como, lake garda, lake maggiore, lake constance, lake baikal, caspian sea, aral sea, dead sea, lake titicaca, lake tanganyika, lake malawi, lake chad, lake nasser, lake volta, great salt lake, crater lake, lake tahoe, lake placid, lake louise, great bear lake, great slave lake, lake winnipeg, lake nicaragua, lake balaton, lake ladoga, lake onega, lake vanern, lake inari, lough neagh, bala lake, coniston water, ullswater, derwentwater, wast water, lake eyre, lake taupo, lake toba, lake tonle sap, lake turkana",
    bias: { "loch ness": 1.4, windermere: 1.1 },
  },
  {
    id: "volcano",
    text: "Name a volcano",
    answers:
      "vesuvius, etna, stromboli, krakatoa, mount fuji, mount st helens, kilauea, mauna loa, popocatepetl, cotopaxi, chimborazo, mount rainier, mount hood, mount shasta, mount erebus, mount pinatubo, mount merapi, mount agung, mount tambora, eyjafjallajokull, hekla, katla, mount nyiragongo, kilimanjaro, mount cameroon, teide, santorini, thera, mount ararat, mount elbrus, mount taranaki, white island, mount ruapehu, mount unzen, sakurajima, mount aso, paricutin, lassen peak, novarupta, mount pelee, soufriere hills, mount bromo, mount semeru, mount mayon, taal",
    bias: { vesuvius: 1.6, etna: 1.4, krakatoa: 1.2 },
  },
  {
    id: "capital-city",
    text: "Name a capital city",
    answers:
      "london, paris, berlin, madrid, rome, lisbon, athens, amsterdam, brussels, vienna, prague, budapest, warsaw, moscow, kyiv|kiev, stockholm, oslo, copenhagen, helsinki, reykjavik, dublin, bern, luxembourg, monaco, valletta, nicosia, ankara, bucharest, sofia, belgrade, zagreb, ljubljana, sarajevo, skopje, tirana, podgorica, riga, vilnius, tallinn, minsk, washington dc|washington, ottawa, mexico city, havana, brasilia, buenos aires, santiago, lima, bogota, caracas, quito, la paz, montevideo, asuncion, tokyo, beijing, seoul, bangkok, hanoi, manila, jakarta, kuala lumpur, singapore, new delhi|delhi, islamabad, dhaka, kathmandu, colombo, kabul, tehran, baghdad, riyadh, doha, abu dhabi, muscat, amman, damascus, beirut, jerusalem, cairo, nairobi, addis ababa, accra, abuja, algiers, tunis, tripoli, rabat, pretoria, canberra, wellington, suva, ulaanbaatar, astana, tashkent, baku, tbilisi, yerevan",
    bias: { london: 1.5, paris: 1.5, singapore: 0.5, jerusalem: 0.4 },
  },
  {
    id: "european-city",
    text: "Name a city in Europe (not a capital)",
    answers:
      "barcelona, milan, naples, florence, venice, turin, bologna, verona, pisa, genoa, seville, valencia, bilbao, granada, malaga, zaragoza, porto, marseille, lyon, bordeaux, toulouse, nice, lille, nantes, strasbourg, munich, hamburg, cologne, frankfurt, stuttgart, dusseldorf, dresden, leipzig, bremen, hanover, nuremberg, rotterdam, the hague, utrecht, eindhoven, antwerp, bruges, ghent, salzburg, innsbruck, graz, zurich, geneva, basel, lausanne, krakow, gdansk, wroclaw, poznan, brno, ostrava, thessaloniki, izmir, antalya, saint petersburg, novosibirsk, gothenburg, malmo, bergen, trondheim, aarhus, tampere, turku, tartu, lviv, odessa, kharkiv, cluj, timisoara, plovdiv, split, dubrovnik, zadar, rijeka, cork, galway, belfast, glasgow, edinburgh, manchester, liverpool, birmingham, leeds, bristol, cardiff",
    bias: { barcelona: 1.5, milan: 1.3, venice: 1.2 },
  },
  {
    id: "us-state",
    text: "Name a US state",
    answers:
      "california, texas, florida, new york, alaska, hawaii, nevada, arizona, utah, colorado, new mexico, oregon, washington, idaho, montana, wyoming, north dakota, south dakota, nebraska, kansas, oklahoma, minnesota, iowa, missouri, arkansas, louisiana, mississippi, alabama, georgia, tennessee, kentucky, indiana, illinois, ohio, michigan, wisconsin, west virginia, virginia, north carolina, south carolina, pennsylvania, new jersey, delaware, maryland, connecticut, rhode island, massachusetts, vermont, new hampshire, maine",
    bias: { california: 1.6, texas: 1.5, florida: 1.4, washington: 0.4, georgia: 0.4, virginia: 0.6, indiana: 0.6 },
  },
  {
    id: "us-city",
    text: "Name a city in the United States",
    answers:
      "new york, los angeles, chicago, houston, phoenix, philadelphia, san antonio, san diego, dallas, austin, san jose, fort worth, jacksonville, columbus, charlotte, indianapolis, san francisco, seattle, denver, nashville, oklahoma city, boston, las vegas, portland, detroit, memphis, louisville, baltimore, milwaukee, albuquerque, tucson, fresno, sacramento, kansas city, atlanta, miami, raleigh, omaha, minneapolis, tulsa, cleveland, wichita, arlington, new orleans, honolulu, anchorage, pittsburgh, cincinnati, st louis, tampa, orlando, buffalo, salt lake city, boise, reno, savannah, charleston, richmond, providence, hartford, albany, spokane, madison, des moines",
    bias: { "new york": 1.6, "los angeles": 1.4, chicago: 1.3 },
  },
  {
    id: "uk-city",
    text: "Name a city in the UK",
    answers:
      "london, birmingham, manchester, liverpool, leeds, sheffield, bristol, newcastle, nottingham, leicester, coventry, bradford, cardiff, belfast, glasgow, edinburgh, aberdeen, dundee, inverness, stirling, perth, swansea, newport, bangor, st davids, york, bath, oxford, cambridge, brighton, portsmouth, southampton, plymouth, exeter, norwich, ipswich, derby, stoke, wolverhampton, sunderland, hull, middlesbrough, preston, blackpool, lancaster, carlisle, durham, lincoln, chester, salisbury, winchester, canterbury, ely, wells, truro, ripon, lichfield, worcester, gloucester, hereford, peterborough, chelmsford, st albans, milton keynes, reading, luton, watford, swindon, doncaster, wakefield, salford, londonderry|derry, lisburn, armagh, newry",
    bias: { london: 1.6, manchester: 1.3, birmingham: 1.2 },
  },
  {
    id: "world-city",
    text: "Name a city outside Europe and the US",
    answers:
      "tokyo, osaka, kyoto, yokohama, sapporo, seoul, busan, beijing, shanghai, guangzhou, shenzhen, chengdu, hong kong, macau, taipei, bangkok, chiang mai, hanoi, ho chi minh city|saigon, phnom penh, vientiane, yangon, singapore, kuala lumpur, jakarta, surabaya, bali, manila, cebu, mumbai, delhi, bangalore, chennai, kolkata, hyderabad, jaipur, agra, karachi, lahore, islamabad, dhaka, kathmandu, colombo, dubai, abu dhabi, doha, riyadh, jeddah, muscat, kuwait city, tehran, baghdad, istanbul, cairo, alexandria, casablanca, marrakesh, tunis, lagos, abuja, accra, nairobi, mombasa, addis ababa, kampala, dar es salaam, johannesburg, cape town, durban, pretoria, harare, lusaka, luanda, toronto, montreal, vancouver, calgary, ottawa, quebec city, mexico city, guadalajara, cancun, havana, kingston, san juan, panama city, bogota, medellin, lima, quito, la paz, santiago, buenos aires, rio de janeiro, sao paulo, brasilia, salvador, montevideo, asuncion, caracas, sydney, melbourne, brisbane, perth, adelaide, canberra, auckland, wellington, christchurch",
    bias: { tokyo: 1.4, sydney: 1.3, dubai: 1.2 },
  },
  {
    id: "river",
    text: "Name a river",
    answers:
      "nile, amazon, thames, mississippi, danube, rhine, seine, ganges, yangtze, yellow river, mekong, volga, congo, niger, zambezi, euphrates, tigris, indus, brahmaputra, colorado, rio grande, missouri, hudson, potomac, st lawrence, mackenzie, yukon, ob, lena, yenisei, amur, po, tiber, ebro, tagus, loire, rhone, elbe, oder, vistula, dnieper, don, severn, trent, mersey, tyne, clyde, shannon, liffey, avon, ouse, murray, darling, orinoco, parana, magdalena, limpopo, orange river, jordan, yarra, douro, guadalquivir, arno, moselle, meuse, scheldt, tweed, forth, dee, wye, tamar, medway, aire, calder, swale, irrawaddy, salween, chao phraya, godavari, krishna, narmada, syr darya, amu darya",
    bias: { nile: 1.6, amazon: 0.5, thames: 1.3, jordan: 0.05, don: 0.02, avon: 0.2, po: 0.02, ouse: 0.3, dee: 0.1 },
  },
  {
    id: "mountain",
    text: "Name a mountain",
    answers:
      "everest, kilimanjaro, k2, mont blanc, matterhorn, denali, fuji|mount fuji, ben nevis, snowdon, scafell pike, vesuvius, etna, olympus, ararat, sinai, table mountain, aconcagua, elbrus, kosciuszko, annapurna, nanga parbat, makalu, lhotse, cho oyu, kangchenjunga, eiger, jungfrau, rainier, whitney, shasta, hood, st helens, popocatepetl, cotopaxi, chimborazo, pikes peak, half dome, el capitan, ayers rock|uluru, kirkjufell, ben macdui, helvellyn, cadair idris, croagh patrick, stromboli, krakatoa, mauna kea, mauna loa, teide, mount kenya, mount meru, mount cook, mount olympus, monte rosa, grossglockner, triglav, zugspitze, pen y fan, slieve donard, carrauntoohil, tryfan, catbells",
    bias: { everest: 2, olympus: 0.4, sinai: 0.3, hood: 0.02, whitney: 0.1 },
  },
  {
    id: "mountain-range",
    text: "Name a mountain range",
    answers:
      "himalayas, andes, alps, rockies|rocky mountains, appalachians, pyrenees, atlas mountains, ural mountains, caucasus, carpathians, apennines, dolomites, sierra nevada, cascades, karakoram, hindu kush, tian shan, altai, zagros, drakensberg, ruwenzori, great dividing range, southern alps, pennines, cairngorms, grampians, cambrian mountains, brecon beacons, snowdonia, mourne mountains, wicklow mountains, scandinavian mountains, taurus, balkans, transylvanian alps, kunlun, pamirs, sayan, brooks range, alaska range, adirondacks, catskills, ozarks, blue ridge, smoky mountains, tetons, wasatch, bitterroots, coast mountains, laurentians",
    bias: { himalayas: 1.6, alps: 1.5, andes: 1.4 },
  },
  {
    id: "ocean-sea",
    text: "Name an ocean or sea",
    answers:
      "pacific, atlantic, indian ocean, arctic, southern ocean|antarctic ocean, mediterranean, caribbean, north sea, baltic sea, black sea, red sea, dead sea, caspian sea, aral sea, arabian sea, coral sea, tasman sea, bering sea, barents sea, norwegian sea, irish sea, celtic sea, adriatic, aegean, ionian sea, tyrrhenian sea, sea of japan, south china sea, east china sea, yellow sea, philippine sea, andaman sea, timor sea, sargasso sea, weddell sea, ross sea, laptev sea, kara sea, sea of okhotsk, gulf of mexico, persian gulf, bay of bengal, hudson bay, english channel, sea of marmara, ligurian sea, balearic sea, white sea, beaufort sea, chukchi sea, banda sea, java sea, sulu sea, arafura sea, labrador sea",
    bias: { pacific: 1.6, atlantic: 1.6, indian: 0.3 },
  },
  {
    id: "strait-canal",
    text: "Name a strait, channel or canal",
    answers:
      "suez canal, panama canal, english channel, strait of gibraltar, bosphorus, dardanelles, strait of hormuz, strait of malacca, bering strait, magellan strait, drake passage, cook strait, bass strait, torres strait, danish straits, kattegat, skagerrak, oresund, strait of dover, north channel, st georges channel, mozambique channel, taiwan strait, korea strait, tsugaru strait, palk strait, sunda strait, lombok strait, kiel canal, corinth canal, grand canal, erie canal, caledonian canal, manchester ship canal, welland canal, rideau canal, bridgewater canal, gota canal",
    bias: { "suez canal": 1.5, "panama canal": 1.5 },
  },
  {
    id: "landlocked-country",
    text: "Name a landlocked country",
    answers:
      "switzerland, austria, hungary, czech republic|czechia, slovakia, serbia, north macedonia, kosovo, moldova, belarus, luxembourg, liechtenstein, andorra, san marino, vatican city, mongolia, nepal, bhutan, laos, afghanistan, kazakhstan, uzbekistan, turkmenistan, kyrgyzstan, tajikistan, armenia, azerbaijan, bolivia, paraguay, mali, niger, chad, burkina faso, central african republic, south sudan, ethiopia, uganda, rwanda, burundi, zambia, zimbabwe, botswana, malawi, lesotho, eswatini|swaziland",
    bias: { switzerland: 1.6, austria: 1.3, mongolia: 1.2, chad: 0.1, niger: 0.3 },
  },
  {
    id: "language",
    text: "Name a language",
    answers:
      "english, spanish, french, german, italian, portuguese, dutch, russian, polish, czech, greek, swedish, norwegian, danish, finnish, icelandic, hungarian, romanian, bulgarian, croatian, serbian, ukrainian, turkish, arabic, hebrew, farsi|persian, urdu, hindi, bengali, punjabi, tamil, telugu, gujarati, marathi, mandarin, cantonese, chinese, japanese, korean, vietnamese, thai, indonesian, malay, tagalog|filipino, swahili, zulu, xhosa, afrikaans, amharic, yoruba, hausa, igbo, welsh, irish|gaelic, scottish gaelic, cornish, manx, breton, basque, catalan, galician, latin, esperanto, sign language, maori, hawaiian, navajo, quechua, aymara, guarani, mongolian, nepali, sinhalese, burmese, khmer, lao, pashto, kurdish, albanian, latvian, lithuanian, estonian, slovak, slovenian, maltese, luxembourgish, frisian, faroese, sami, georgian, armenian, azerbaijani, kazakh, uzbek",
    bias: { english: 1.5, spanish: 1.4, french: 1.4, latin: 0.5 },
  },
  {
    id: "currency",
    text: "Name a currency",
    answers:
      "pound|pound sterling, euro, dollar, us dollar, yen, yuan|renminbi, rupee, rouble|ruble, franc, swiss franc, krona, krone, zloty, forint, koruna, lev, leu, kuna, dinar, dirham, riyal, shekel, lira, rand, naira, cedi, shilling, birr, kwacha, kwanza, peso, real, sol, boliviano, guarani, colon, quetzal, cordoba, lempira, balboa, bolivar, won, ringgit, baht, dong, kip, rupiah, taka, kyat, tugrik, tenge, som, manat, lari, dram, hryvnia, escudo, guilder, drachma, deutschmark, bitcoin",
    bias: { pound: 1.5, euro: 1.6, dollar: 1.6 },
  },
  {
    id: "landmark",
    text: "Name a famous landmark",
    answers:
      "eiffel tower, big ben, statue of liberty, great wall of china, taj mahal, colosseum, pyramids of giza, sphinx, machu picchu, christ the redeemer, sydney opera house, golden gate bridge, tower bridge, stonehenge, acropolis, parthenon, leaning tower of pisa, sagrada familia, notre dame, louvre, arc de triomphe, brandenburg gate, buckingham palace, tower of london, st pauls cathedral, westminster abbey, angkor wat, petra, chichen itza, mount rushmore, empire state building, chrysler building, times square, hollywood sign, space needle, cn tower, burj khalifa, palm jumeirah, forbidden city, terracotta army, hagia sophia, blue mosque, neuschwanstein, mont saint michel, alhambra, red square, st basils cathedral, kremlin, little mermaid, atomium, manneken pis, trevi fountain, pantheon, vatican, sistine chapel, uluru, giants causeway, cliffs of moher, blarney stone, edinburgh castle, hadrians wall, angel of the north, shard, london eye, gherkin, white house, capitol building, lincoln memorial, washington monument, alcatraz, niagara falls, victoria falls, iguazu falls",
    bias: { "eiffel tower": 1.6, "big ben": 1.4 },
  },
  {
    id: "national-park",
    text: "Name a national park",
    answers:
      "yellowstone, yosemite, grand canyon, zion, bryce canyon, arches, joshua tree, death valley, sequoia, redwood, glacier, rocky mountain, everglades, acadia, olympic, mount rainier, crater lake, denali, badlands, shenandoah, great smoky mountains, banff, jasper, lake district, peak district, snowdonia, dartmoor, exmoor, new forest, yorkshire dales, north york moors, northumberland, brecon beacons, pembrokeshire coast, cairngorms, loch lomond, the broads, south downs, serengeti, masai mara, kruger, etosha, chobe, okavango, ngorongoro, amboseli, tsavo, virunga, ranthambore, jim corbett, kaziranga, komodo, torres del paine, iguazu, galapagos, tikal, plitvice, triglav, hortobagy, kakadu, uluru, blue mountains, fiordland, tongariro, abel tasman",
    bias: { yellowstone: 1.5, "grand canyon": 1.4 },
  },
];

