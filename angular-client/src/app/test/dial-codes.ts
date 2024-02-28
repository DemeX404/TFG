import { Injectable } from '@angular/core';

@Injectable()
export class worldCodeService {
    // TODO: get from a remote source of question metadata
    getWorldCodeService() {
        const worldCode: any = [
            {
                "data": [
                    {
                        "code": "AF",
                        "name": "Afganistán",
                        "phoneCode": "93"
                    },
                    {
                        "code": "AX",
                        "name": "Islas Aland",
                        "phoneCode": "358"
                    },
                    {
                        "code": "AL",
                        "name": "Albania",
                        "phoneCode": "355"
                    },
                    {
                        "code": "DZ",
                        "name": "Algeria",
                        "phoneCode": "213"
                    },
                    {
                        "code": "AS",
                        "name": "Samoa Americana",
                        "phoneCode": "1684"
                    },
                    {
                        "code": "AD",
                        "name": "Andorra",
                        "phoneCode": "376"
                    },
                    {
                        "code": "AO",
                        "name": "Angola",
                        "phoneCode": "244"
                    },
                    {
                        "code": "AI",
                        "name": "Anguilla",
                        "phoneCode": "1264"
                    },
                    {
                        "code": "AQ",
                        "name": "Antartica",
                        "phoneCode": "672"
                    },
                    {
                        "code": "AG",
                        "name": "Antigua y Barbuda",
                        "phoneCode": "1268"
                    },
                    {
                        "code": "AR",
                        "name": "Argentina",
                        "phoneCode": "54"
                    },
                    {
                        "code": "AM",
                        "name": "Armenia",
                        "phoneCode": "374"
                    },
                    {
                        "code": "AW",
                        "name": "Aruba",
                        "phoneCode": "297"
                    },
                    {
                        "code": "AU",
                        "name": "Australia",
                        "phoneCode": "61"
                    },
                    {
                        "code": "AT",
                        "name": "Austria",
                        "phoneCode": "43"
                    },
                    {
                        "code": "AZ",
                        "name": "Azerbaijan",
                        "phoneCode": "994"
                    },
                    {
                        "code": "BS",
                        "name": "Bahamas",
                        "phoneCode": "1242"
                    },
                    {
                        "code": "BH",
                        "name": "Baréin",
                        "phoneCode": "973"
                    },
                    {
                        "code": "BD",
                        "name": "Bangladés",
                        "phoneCode": "880"
                    },
                    {
                        "code": "BB",
                        "name": "Barbados",
                        "phoneCode": "1246"
                    },
                    {
                        "code": "BY",
                        "name": "Bielorrusia",
                        "phoneCode": "375"
                    },
                    {
                        "code": "BE",
                        "name": "Belgica",
                        "phoneCode": "32"
                    },
                    {
                        "code": "BZ",
                        "name": "Belice",
                        "phoneCode": "501"
                    },
                    {
                        "code": "BJ",
                        "name": "Benín",
                        "phoneCode": "229"
                    },
                    {
                        "code": "BM",
                        "name": "Bermuda",
                        "phoneCode": "1441"
                    },
                    {
                        "code": "BT",
                        "name": "Bután",
                        "phoneCode": "975"
                    },
                    {
                        "code": "BO",
                        "name": "Bolivia",
                        "phoneCode": "591"
                    },
                    {
                        "code": "BA",
                        "name": "Bosnia y Herzegovina",
                        "phoneCode": "387"
                    },
                    {
                        "code": "BW",
                        "name": "Botsuana",
                        "phoneCode": "267"
                    },
                    {
                        "code": "BR",
                        "name": "Brasil",
                        "phoneCode": "55"
                    },
                    {
                        "code": "IO",
                        "name": "Territorio Británico del Océano Índico",
                        "phoneCode": "246"
                    },
                    {
                        "code": "BN",
                        "name": "Brunéi",
                        "phoneCode": "673"
                    },
                    {
                        "code": "BG",
                        "name": "Bulgaria",
                        "phoneCode": "359"
                    },
                    {
                        "code": "BF",
                        "name": "Burkina Faso",
                        "phoneCode": "226"
                    },
                    {
                        "code": "BI",
                        "name": "Burundi",
                        "phoneCode": "257"
                    },
                    {
                        "code": "KH",
                        "name": "Camboya",
                        "phoneCode": "855"
                    },
                    {
                        "code": "CM",
                        "name": "Camerún",
                        "phoneCode": "237"
                    },
                    {
                        "code": "CA",
                        "name": "Canadá",
                        "phoneCode": "1"
                    },
                    {
                        "code": "CV",
                        "name": "Cabo Verde",
                        "phoneCode": "238"
                    },
                    {
                        "code": "KY",
                        "name": "Ilsas Caimán",
                        "phoneCode": " 345"
                    },
                    {
                        "code": "CF",
                        "name": "República Centroafricana",
                        "phoneCode": "236"
                    },
                    {
                        "code": "TD",
                        "name": "Chad",
                        "phoneCode": "235"
                    },
                    {
                        "code": "CL",
                        "name": "Chile",
                        "phoneCode": "56"
                    },
                    {
                        "code": "CN",
                        "name": "China",
                        "phoneCode": "86"
                    },
                    {
                        "code": "CX",
                        "name": "Ilsa de Navidad",
                        "phoneCode": "61"
                    },
                    {
                        "code": "CC",
                        "name": "Ilsas Cocos",
                        "phoneCode": "61"
                    },
                    {
                        "code": "CO",
                        "name": "Colombia",
                        "phoneCode": "57"
                    },
                    {
                        "code": "KM",
                        "name": "Comoras",
                        "phoneCode": "269"
                    },
                    {
                        "code": "CG",
                        "name": "Congo",
                        "phoneCode": "242"
                    },
                    {
                        "code": "CD",
                        "name": "República del Congo",
                        "phoneCode": "243"
                    },
                    {
                        "code": "CK",
                        "name": "Islas Cook",
                        "phoneCode": "682"
                    },
                    {
                        "code": "CR",
                        "name": "Costa Rica",
                        "phoneCode": "506"
                    },
                    {
                        "code": "CI",
                        "name": "Coste de Marfil",
                        "phoneCode": "225"
                    },
                    {
                        "code": "HR",
                        "name": "Croacia",
                        "phoneCode": "385"
                    },
                    {
                        "code": "CU",
                        "name": "Cuba",
                        "phoneCode": "53"
                    },
                    {
                        "code": "CY",
                        "name": "Chipre",
                        "phoneCode": "357"
                    },
                    {
                        "code": "CZ",
                        "name": "República Checa",
                        "phoneCode": "420"
                    },
                    {
                        "code": "DK",
                        "name": "Dinamarca",
                        "phoneCode": "45"
                    },
                    {
                        "code": "DJ",
                        "name": "Yibuti",
                        "phoneCode": "253"
                    },
                    {
                        "code": "DM",
                        "name": "Dominica",
                        "phoneCode": "1767"
                    },
                    {
                        "code": "DO",
                        "name": "República Dominicana",
                        "phoneCode": "1849"
                    },
                    {
                        "code": "EC",
                        "name": "Ecuador",
                        "phoneCode": "593"
                    },
                    {
                        "code": "EG",
                        "name": "Egipto",
                        "phoneCode": "20"
                    },
                    {
                        "code": "SV",
                        "name": "El Salvador",
                        "phoneCode": "503"
                    },
                    {
                        "code": "GQ",
                        "name": "Guinea Ecuatorial",
                        "phoneCode": "240"
                    },
                    {
                        "code": "ER",
                        "name": "Eritrea",
                        "phoneCode": "291"
                    },
                    {
                        "code": "EE",
                        "name": "Estonia",
                        "phoneCode": "372"
                    },
                    {
                        "code": "ET",
                        "name": "Etiopía",
                        "phoneCode": "251"
                    },
                    {
                        "code": "FK",
                        "name": "Islas Malvinas",
                        "phoneCode": "500"
                    },
                    {
                        "code": "FO",
                        "name": "Islas Feroe",
                        "phoneCode": "298"
                    },
                    {
                        "code": "FJ",
                        "name": "Fiyi",
                        "phoneCode": "679"
                    },
                    {
                        "code": "FI",
                        "name": "Finlandia",
                        "phoneCode": "358"
                    },
                    {
                        "code": "FR",
                        "name": "Francia",
                        "phoneCode": "33"
                    },
                    {
                        "code": "GF",
                        "name": "Guayana Francesa",
                        "phoneCode": "594"
                    },
                    {
                        "code": "PF",
                        "name": "Polinesia Francesa",
                        "phoneCode": "689"
                    },
                    {
                        "code": "GA",
                        "name": "Gabón",
                        "phoneCode": "241"
                    },
                    {
                        "code": "GM",
                        "name": "Gambia",
                        "phoneCode": "220"
                    },
                    {
                        "code": "GE",
                        "name": "Georgia",
                        "phoneCode": "995"
                    },
                    {
                        "code": "DE",
                        "name": "Alemania",
                        "phoneCode": "49"
                    },
                    {
                        "code": "GH",
                        "name": "Ghana",
                        "phoneCode": "233"
                    },
                    {
                        "code": "GI",
                        "name": "Gibraltar",
                        "phoneCode": "350"
                    },
                    {
                        "code": "GR",
                        "name": "Grecia",
                        "phoneCode": "30"
                    },
                    {
                        "code": "GL",
                        "name": "Groenlandia",
                        "phoneCode": "299"
                    },
                    {
                        "code": "GD",
                        "name": "Granada",
                        "phoneCode": "1473"
                    },
                    {
                        "code": "GP",
                        "name": "Guadalupe",
                        "phoneCode": "590"
                    },
                    {
                        "code": "GU",
                        "name": "Guam",
                        "phoneCode": "1671"
                    },
                    {
                        "code": "GT",
                        "name": "Guatemala",
                        "phoneCode": "502"
                    },
                    {
                        "code": "GG",
                        "name": "Guernsey",
                        "phoneCode": "44"
                    },
                    {
                        "code": "GN",
                        "name": "Guinea",
                        "phoneCode": "224"
                    },
                    {
                        "code": "GW",
                        "name": "Guinea-Bisáu",
                        "phoneCode": "245"
                    },
                    {
                        "code": "GY",
                        "name": "Guyana",
                        "phoneCode": "595"
                    },
                    {
                        "code": "HT",
                        "name": "Haití",
                        "phoneCode": "509"
                    },
                    {
                        "code": "VA",
                        "name": "Estado Vaticano",
                        "phoneCode": "379"
                    },
                    {
                        "code": "HN",
                        "name": "Honduras",
                        "phoneCode": "504"
                    },
                    {
                        "code": "HK",
                        "name": "Hong Kong",
                        "phoneCode": "852"
                    },
                    {
                        "code": "HU",
                        "name": "Hungría",
                        "phoneCode": "36"
                    },
                    {
                        "code": "IS",
                        "name": "Islandia",
                        "phoneCode": "354"
                    },
                    {
                        "code": "IN",
                        "name": "India",
                        "phoneCode": "91"
                    },
                    {
                        "code": "ID",
                        "name": "Indonesia",
                        "phoneCode": "62"
                    },
                    {
                        "code": "IR",
                        "name": "Irán",
                        "phoneCode": "98"
                    },
                    {
                        "code": "IQ",
                        "name": "Iraq",
                        "phoneCode": "964"
                    },
                    {
                        "code": "IE",
                        "name": "Irlanda",
                        "phoneCode": "353"
                    },
                    {
                        "code": "IM",
                        "name": "Isla de Man",
                        "phoneCode": "44"
                    },
                    {
                        "code": "IL",
                        "name": "Israel",
                        "phoneCode": "972"
                    },
                    {
                        "code": "IT",
                        "name": "Italia",
                        "phoneCode": "39"
                    },
                    {
                        "code": "JM",
                        "name": "Jamaica",
                        "phoneCode": "1876"
                    },
                    {
                        "code": "JP",
                        "name": "Japón",
                        "phoneCode": "81"
                    },
                    {
                        "code": "JE",
                        "name": "Jersey",
                        "phoneCode": "44"
                    },
                    {
                        "code": "JO",
                        "name": "Jordania",
                        "phoneCode": "962"
                    },
                    {
                        "code": "KZ",
                        "name": "Kazajistán",
                        "phoneCode": "77"
                    },
                    {
                        "code": "KE",
                        "name": "Kenia",
                        "phoneCode": "254"
                    },
                    {
                        "code": "KI",
                        "name": "Kiribati",
                        "phoneCode": "686"
                    },
                    {
                        "code": "KP",
                        "name": "Corea del Norte",
                        "phoneCode": "850"
                    },
                    {
                        "code": "KR",
                        "name": "Corea del Sur",
                        "phoneCode": "82"
                    },
                    {
                        "code": "KW",
                        "name": "Kuwait",
                        "phoneCode": "965"
                    },
                    {
                        "code": "KG",
                        "name": "Kirguistán",
                        "phoneCode": "996"
                    },
                    {
                        "code": "LA",
                        "name": "Laos",
                        "phoneCode": "856"
                    },
                    {
                        "code": "LV",
                        "name": "Letonia",
                        "phoneCode": "371"
                    },
                    {
                        "code": "LB",
                        "name": "Libano",
                        "phoneCode": "961"
                    },
                    {
                        "code": "LS",
                        "name": "Lesoto",
                        "phoneCode": "266"
                    },
                    {
                        "code": "LR",
                        "name": "Liberia",
                        "phoneCode": "231"
                    },
                    {
                        "code": "LY",
                        "name": "Libia",
                        "phoneCode": "218"
                    },
                    {
                        "code": "LI",
                        "name": "Liechtenstein",
                        "phoneCode": "423"
                    },
                    {
                        "code": "LT",
                        "name": "Lituania",
                        "phoneCode": "370"
                    },
                    {
                        "code": "LU",
                        "name": "Luxemburgo",
                        "phoneCode": "352"
                    },
                    {
                        "code": "MO",
                        "name": "Macao",
                        "phoneCode": "853"
                    },
                    {
                        "code": "MK",
                        "name": "Macedonia",
                        "phoneCode": "389"
                    },
                    {
                        "code": "MG",
                        "name": "Madagascar",
                        "phoneCode": "261"
                    },
                    {
                        "code": "MW",
                        "name": "Malawi",
                        "phoneCode": "265"
                    },
                    {
                        "code": "MY",
                        "name": "Malasia",
                        "phoneCode": "60"
                    },
                    {
                        "code": "MV",
                        "name": "Maldivas",
                        "phoneCode": "960"
                    },
                    {
                        "code": "ML",
                        "name": "Mali",
                        "phoneCode": "223"
                    },
                    {
                        "code": "MT",
                        "name": "Malta",
                        "phoneCode": "356"
                    },
                    {
                        "code": "MH",
                        "name": "Islas Marshall",
                        "phoneCode": "692"
                    },
                    {
                        "code": "MQ",
                        "name": "Martinica",
                        "phoneCode": "596"
                    },
                    {
                        "code": "MR",
                        "name": "Mauritania",
                        "phoneCode": "222"
                    },
                    {
                        "code": "MU",
                        "name": "Mauricio",
                        "phoneCode": "230"
                    },
                    {
                        "code": "YT",
                        "name": "Mayotte",
                        "phoneCode": "262"
                    },
                    {
                        "code": "MX",
                        "name": "Méjico",
                        "phoneCode": "52"
                    },
                    {
                        "code": "FM",
                        "name": "Micronesia",
                        "phoneCode": "691"
                    },
                    {
                        "code": "MD",
                        "name": "Moldavia",
                        "phoneCode": "373"
                    },
                    {
                        "code": "MC",
                        "name": "Monaco",
                        "phoneCode": "377"
                    },
                    {
                        "code": "MN",
                        "name": "Mongolia",
                        "phoneCode": "976"
                    },
                    {
                        "code": "ME",
                        "name": "Montenegro",
                        "phoneCode": "382"
                    },
                    {
                        "code": "MS",
                        "name": "Montserrat",
                        "phoneCode": "1664"
                    },
                    {
                        "code": "MA",
                        "name": "Marruecos",
                        "phoneCode": "212"
                    },
                    {
                        "code": "MZ",
                        "name": "Mozambique",
                        "phoneCode": "258"
                    },
                    {
                        "code": "MM",
                        "name": "Birmania",
                        "phoneCode": "95"
                    },
                    {
                        "code": "NA",
                        "name": "Namibia",
                        "phoneCode": "264"
                    },
                    {
                        "code": "NR",
                        "name": "Nauru",
                        "phoneCode": "674"
                    },
                    {
                        "code": "NP",
                        "name": "Nepal",
                        "phoneCode": "977"
                    },
                    {
                        "code": "NL",
                        "name": "Holanda",
                        "phoneCode": "31"
                    },
                    {
                        "code": "AN",
                        "name": "Antillas Holandesas",
                        "phoneCode": "599"
                    },
                    {
                        "code": "NC",
                        "name": "Nueva Caledonia",
                        "phoneCode": "687"
                    },
                    {
                        "code": "NZ",
                        "name": "Nueva Zelanda",
                        "phoneCode": "64"
                    },
                    {
                        "code": "NI",
                        "name": "Nicaragua",
                        "phoneCode": "505"
                    },
                    {
                        "code": "NE",
                        "name": "Níger",
                        "phoneCode": "227"
                    },
                    {
                        "code": "NG",
                        "name": "Nigeria",
                        "phoneCode": "234"
                    },
                    {
                        "code": "NU",
                        "name": "Niue",
                        "phoneCode": "683"
                    },
                    {
                        "code": "NF",
                        "name": "Ilsa Norfolk",
                        "phoneCode": "672"
                    },
                    {
                        "code": "MP",
                        "name": "Islas Marianas del Norte",
                        "phoneCode": "1670"
                    },
                    {
                        "code": "NO",
                        "name": "Noruega",
                        "phoneCode": "47"
                    },
                    {
                        "code": "OM",
                        "name": "Oman",
                        "phoneCode": "968"
                    },
                    {
                        "code": "PK",
                        "name": "Pakistán",
                        "phoneCode": "92"
                    },
                    {
                        "code": "PW",
                        "name": "Palaos",
                        "phoneCode": "680"
                    },
                    {
                        "code": "PS",
                        "name": "Territorios Palestinos",
                        "phoneCode": "970"
                    },
                    {
                        "code": "PA",
                        "name": "Panama",
                        "phoneCode": "507"
                    },
                    {
                        "code": "PG",
                        "name": "Papua Nueva Guinea",
                        "phoneCode": "675"
                    },
                    {
                        "code": "PY",
                        "name": "Paraguay",
                        "phoneCode": "595"
                    },
                    {
                        "code": "PE",
                        "name": "Peru",
                        "phoneCode": "51"
                    },
                    {
                        "code": "PH",
                        "name": "Filipinas",
                        "phoneCode": "63"
                    },
                    {
                        "code": "PN",
                        "name": "Islas Pitcairn",
                        "phoneCode": "872"
                    },
                    {
                        "code": "PL",
                        "name": "Polonia",
                        "phoneCode": "48"
                    },
                    {
                        "code": "PT",
                        "name": "Portugal",
                        "phoneCode": "351"
                    },
                    {
                        "code": "PR",
                        "name": "Puerto Rico",
                        "phoneCode": "1939"
                    },
                    {
                        "code": "QA",
                        "name": "Qatar",
                        "phoneCode": "974"
                    },
                    {
                        "code": "RO",
                        "name": "Rumanía",
                        "phoneCode": "40"
                    },
                    {
                        "code": "RU",
                        "name": "Rusia",
                        "phoneCode": "7"
                    },
                    {
                        "code": "RW",
                        "name": "Ruanda",
                        "phoneCode": "250"
                    },
                    {
                        "code": "RE",
                        "name": "Reunión",
                        "phoneCode": "262"
                    },
                    {
                        "code": "BL",
                        "name": "San Bartolomé",
                        "phoneCode": "590"
                    },
                    {
                        "code": "SH",
                        "name": "Isla Santa Elena",
                        "phoneCode": "290"
                    },
                    {
                        "code": "KN",
                        "name": "San Cristóbal y Nieves",
                        "phoneCode": "1869"
                    },
                    {
                        "code": "LC",
                        "name": "Santa Lucia",
                        "phoneCode": "1758"
                    },
                    {
                        "code": "MF",
                        "name": "Isla de San Martín",
                        "phoneCode": "590"
                    },
                    {
                        "code": "PM",
                        "name": "San Pedro y Miguelón",
                        "phoneCode": "508"
                    },
                    {
                        "code": "VC",
                        "name": "San Vicente y las Granadinas",
                        "phoneCode": "1784"
                    },
                    {
                        "code": "WS",
                        "name": "Samoa",
                        "phoneCode": "685"
                    },
                    {
                        "code": "SM",
                        "name": "San Marino",
                        "phoneCode": "378"
                    },
                    {
                        "code": "ST",
                        "name": "Snto Tomé Principe",
                        "phoneCode": "239"
                    },
                    {
                        "code": "SA",
                        "name": "Arabia Saudí",
                        "phoneCode": "966"
                    },
                    {
                        "code": "SN",
                        "name": "Senegal",
                        "phoneCode": "221"
                    },
                    {
                        "code": "RS",
                        "name": "Serbia",
                        "phoneCode": "381"
                    },
                    {
                        "code": "SC",
                        "name": "Seychelles",
                        "phoneCode": "248"
                    },
                    {
                        "code": "SL",
                        "name": "Sierra Leona",
                        "phoneCode": "232"
                    },
                    {
                        "code": "SG",
                        "name": "Singapur",
                        "phoneCode": "65"
                    },
                    {
                        "code": "SK",
                        "name": "Eslovaquia",
                        "phoneCode": "421"
                    },
                    {
                        "code": "SI",
                        "name": "Eslovenia",
                        "phoneCode": "386"
                    },
                    {
                        "code": "SB",
                        "name": "Islas Solomón",
                        "phoneCode": "677"
                    },
                    {
                        "code": "SO",
                        "name": "Somalia",
                        "phoneCode": "252"
                    },
                    {
                        "code": "ZA",
                        "name": "Sudáfrica",
                        "phoneCode": "27"
                    },
                    {
                        "code": "SS",
                        "name": "Sudán del Sur",
                        "phoneCode": "211"
                    },
                    {
                        "code": "GS",
                        "name": "Islas Georgias del Sur y Sandwich del Sur",
                        "phoneCode": "500"
                    },
                    {
                        "code": "ES",
                        "name": "España",
                        "phoneCode": "34"
                    },
                    {
                        "code": "LK",
                        "name": "Sri Lanka",
                        "phoneCode": "94"
                    },
                    {
                        "code": "SD",
                        "name": "Sudán",
                        "phoneCode": "249"
                    },
                    {
                        "code": "SR",
                        "name": "Surinam",
                        "phoneCode": "597"
                    },
                    {
                        "code": "SJ",
                        "name": "Svalbard y Jan Mayen",
                        "phoneCode": "47"
                    },
                    {
                        "code": "SZ",
                        "name": "Suazilandia",
                        "phoneCode": "268"
                    },
                    {
                        "code": "SE",
                        "name": "Suecia",
                        "phoneCode": "46"
                    },
                    {
                        "code": "CH",
                        "name": "Suiza",
                        "phoneCode": "41"
                    },
                    {
                        "code": "SY",
                        "name": "Siria",
                        "phoneCode": "963"
                    },
                    {
                        "code": "TW",
                        "name": "Taiwán",
                        "phoneCode": "886"
                    },
                    {
                        "code": "TJ",
                        "name": "Tayikistán",
                        "phoneCode": "992"
                    },
                    {
                        "code": "TZ",
                        "name": "Tanzania",
                        "phoneCode": "255"
                    },
                    {
                        "code": "TH",
                        "name": "Tailandia",
                        "phoneCode": "66"
                    },
                    {
                        "code": "TL",
                        "name": "Timor Oriental",
                        "phoneCode": "670"
                    },
                    {
                        "code": "TG",
                        "name": "Togo",
                        "phoneCode": "228"
                    },
                    {
                        "code": "TK",
                        "name": "Tokelau",
                        "phoneCode": "690"
                    },
                    {
                        "code": "TO",
                        "name": "Tonga",
                        "phoneCode": "676"
                    },
                    {
                        "code": "TT",
                        "name": "Trinidad y Tobago",
                        "phoneCode": "1868"
                    },
                    {
                        "code": "TN",
                        "name": "Túnez",
                        "phoneCode": "216"
                    },
                    {
                        "code": "TR",
                        "name": "Turquía",
                        "phoneCode": "90"
                    },
                    {
                        "code": "TM",
                        "name": "Turkmenistán",
                        "phoneCode": "993"
                    },
                    {
                        "code": "TC",
                        "name": "Islas Turks y Caicos",
                        "phoneCode": "1649"
                    },
                    {
                        "code": "TV",
                        "name": "Tuvalu",
                        "phoneCode": "688"
                    },
                    {
                        "code": "UG",
                        "name": "Uganda",
                        "phoneCode": "256"
                    },
                    {
                        "code": "UA",
                        "name": "Ucránia",
                        "phoneCode": "380"
                    },
                    {
                        "code": "AE",
                        "name": "Emiratos Árabes Unidos",
                        "phoneCode": "971"
                    },
                    {
                        "code": "GB",
                        "name": "Reino Unido",
                        "phoneCode": "44"
                    },
                    {
                        "code": "US",
                        "name": "Estados Unidos",
                        "phoneCode": "1"
                    },
                    {
                        "code": "UY",
                        "name": "Uruguay",
                        "phoneCode": "598"
                    },
                    {
                        "code": "UZ",
                        "name": "Uzbekistán",
                        "phoneCode": "998"
                    },
                    {
                        "code": "VU",
                        "name": "Vanuatu",
                        "phoneCode": "678"
                    },
                    {
                        "code": "VE",
                        "name": "Venezuela",
                        "phoneCode": "58"
                    },
                    {
                        "code": "VN",
                        "name": "Vietnam",
                        "phoneCode": "84"
                    },
                    {
                        "code": "VG",
                        "name": "Islas Vírgenes Británicas",
                        "phoneCode": "1284"
                    },
                    {
                        "code": "VI",
                        "name": "Islas Vírgenes (EEUU)",
                        "phoneCode": "1340"
                    },
                    {
                        "code": "WF",
                        "name": "Wallis y Futuna",
                        "phoneCode": "681"
                    },
                    {
                        "code": "YE",
                        "name": "Yemen",
                        "phoneCode": "967"
                    },
                    {
                        "code": "ZM",
                        "name": "Zambia",
                        "phoneCode": "260"
                    },
                    {
                        "code": "ZW",
                        "name": "Zimbabue",
                        "phoneCode": "263"
                    }
                ],
                "total": 242,
                "page": 0,
                "pageSize": 20,
                "sort": []
            }
        ];
        return (worldCode);
    }
}