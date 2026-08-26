// Curated prompt bank — geography and the world.

export default [
  {
    id: "european-country",
    text: "Name a country in Europe",
    answers:
      "france, germany, spain, italy, portugal, greece, netherlands|holland, belgium, luxembourg, switzerland, austria, poland, czech republic|czechia, slovakia, hungary, romania, bulgaria, croatia, slovenia, serbia, bosnia, montenegro, albania, north macedonia, kosovo, greece, denmark, sweden, norway, finland, iceland, ireland, united kingdom|uk|britain, estonia, latvia, lithuania, belarus, ukraine, moldova, russia, turkey, cyprus, malta, monaco, andorra, liechtenstein, san marino, vatican city, georgia, armenia",
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
    id: "capital-city",
    text: "Name a capital city",
    answers:
      "london, paris, berlin, madrid, rome, lisbon, athens, amsterdam, brussels, vienna, prague, budapest, warsaw, moscow, kyiv|kiev, stockholm, oslo, copenhagen, helsinki, reykjavik, dublin, bern, luxembourg, monaco, valletta, nicosia, ankara, bucharest, sofia, belgrade, zagreb, ljubljana, sarajevo, skopje, tirana, podgorica, riga, vilnius, tallinn, minsk, washington dc|washington, ottawa, mexico city, havana, brasilia, buenos aires, santiago, lima, bogota, caracas, quito, la paz, montevideo, asuncion, tokyo, beijing, seoul, bangkok, hanoi, manila, jakarta, kuala lumpur, singapore, new delhi|delhi, islamabad, dhaka, kathmandu, colombo, kabul, tehran, baghdad, riyadh, doha, abu dhabi, muscat, amman, damascus, beirut, jerusalem, cairo, nairobi, addis ababa, accra, abuja, algiers, tunis, tripoli, rabat, pretoria, canberra, wellington, suva",
    bias: { london: 1.5, paris: 1.5, singapore: 0.5, jerusalem: 0.4 },
  },
  {
    id: "us-state",
    text: "Name a US state",
    answers:
      "california, texas, florida, new york, alaska, hawaii, nevada, arizona, utah, colorado, new mexico, oregon, washington, idaho, montana, wyoming, north dakota, south dakota, nebraska, kansas, oklahoma, minnesota, iowa, missouri, arkansas, louisiana, mississippi, alabama, georgia, tennessee, kentucky, indiana, illinois, ohio, michigan, wisconsin, west virginia, virginia, north carolina, south carolina, pennsylvania, new jersey, delaware, maryland, connecticut, rhode island, massachusetts, vermont, new hampshire, maine",
    bias: { california: 1.6, texas: 1.5, florida: 1.4, washington: 0.4, georgia: 0.4, virginia: 0.6, indiana: 0.6 },
  },
  {
    id: "river",
    text: "Name a river",
    answers:
      "nile, amazon, thames, mississippi, danube, rhine, seine, ganges, yangtze, yellow river, mekong, volga, congo, niger, zambezi, euphrates, tigris, indus, brahmaputra, colorado, rio grande, missouri, hudson, potomac, st lawrence, mackenzie, yukon, ob, lena, yenisei, amur, po, tiber, ebro, tagus, loire, rhone, elbe, oder, vistula, dnieper, don, severn, trent, mersey, tyne, clyde, shannon, liffey, avon, ouse, murray, darling, orinoco, parana, magdalena, limpopo, orange river, jordan, yarra",
    bias: { nile: 1.6, amazon: 0.5, thames: 1.3, jordan: 0.05, don: 0.02, avon: 0.2, po: 0.02, ouse: 0.3 },
  },
  {
    id: "mountain",
    text: "Name a mountain",
    answers:
      "everest, kilimanjaro, k2, mont blanc, matterhorn, denali, fuji|mount fuji, ben nevis, snowdon, scafell pike, vesuvius, etna, olympus, ararat, sinai, table mountain, aconcagua, elbrus, kosciuszko, annapurna, nanga parbat, makalu, lhotse, cho oyu, kangchenjunga, eiger, jungfrau, rainier, whitney, shasta, hood, st helens, popocatepetl, cotopaxi, chimborazo, pikes peak, half dome, el capitan, ayers rock|uluru, kirkjufell, ben macdui, helvellyn, cadair idris, croagh patrick, stromboli, krakatoa, mauna kea, mauna loa, teide",
    bias: { everest: 2, olympus: 0.4, sinai: 0.3, hood: 0.02, whitney: 0.1 },
  },
  {
    id: "language",
    text: "Name a language",
    answers:
      "english, spanish, french, german, italian, portuguese, dutch, russian, polish, czech, greek, swedish, norwegian, danish, finnish, icelandic, hungarian, romanian, bulgarian, croatian, serbian, ukrainian, turkish, arabic, hebrew, farsi|persian, urdu, hindi, bengali, punjabi, tamil, telugu, gujarati, marathi, mandarin, cantonese, chinese, japanese, korean, vietnamese, thai, indonesian, malay, tagalog|filipino, swahili, zulu, afrikaans, amharic, yoruba, hausa, igbo, welsh, irish|gaelic, scottish gaelic, cornish, breton, basque, catalan, galician, latin, esperanto, sign language, maori, hawaiian, navajo, quechua, mongolian, nepali, sinhalese, burmese, khmer, lao, pashto, kurdish, albanian, latvian, lithuanian, estonian, slovak, slovenian, maltese, luxembourgish",
    bias: { english: 1.5, spanish: 1.4, french: 1.4, latin: 0.5 },
  },
  {
    id: "ocean-sea",
    text: "Name an ocean or sea",
    answers:
      "pacific, atlantic, indian ocean, arctic, southern ocean|antarctic ocean, mediterranean, caribbean, north sea, baltic sea, black sea, red sea, dead sea, caspian sea, aral sea, arabian sea, coral sea, tasman sea, bering sea, barents sea, norwegian sea, irish sea, celtic sea, adriatic, aegean, ionian sea, tyrrhenian sea, sea of japan, south china sea, east china sea, yellow sea, philippine sea, andaman sea, timor sea, sargasso sea, weddell sea, ross sea, laptev sea, kara sea, sea of okhotsk, gulf of mexico, persian gulf, bay of bengal, hudson bay, english channel",
    bias: { pacific: 1.6, atlantic: 1.6, indian: 0.3 },
  },
]
