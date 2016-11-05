import distance from "./distance"

export default class {
	constructor(){
		this.phonemes = [
	{
		"name": "Aalto Valimo",
		"id": 8,
		"soundsLike": [
			"aalto valimo",
			"valimo"
		]
	},
	{
		"name": "Alvari",
		"id": 5,
		"soundsLike": [
			"alvari"
		]
	},
	{
		"name": "Cafe Portaali",
		"id": 13,
		"soundsLike": [
			"cafe portaali",
			"portaali"
		]
	},
	{
		"name": "Cafespa",
		"id": 14,
		"soundsLike": [
			"cafespa"
		]
	},
	{
		"name": "Chydenia",
		"id": 23,
		"soundsLike": [
			"chydenia"
		]
	},
	{
		"name": "Electra",
		"id": 4,
		"soundsLike": [
			"electra"
		]
	},
	{
		"name": "Gaudeamus Kirja & Kahvi",
		"id": 15,
		"soundsLike": [
			"gaudeamus kirja ja kahvi"
		]
	},
	{
		"name": "Hanken",
		"id": 24,
		"soundsLike": [
			"hanken"
		]
	},
	{
		"name": "Hämäläis-Osakunta",
		"id": 26,
		"soundsLike": [
			"hämäläis-osakunta"
		]
	},
	{
		"name": "Konetekniikka",
		"id": 10,
		"soundsLike": [
			"konetekniikka"
		]
	},
	{
		"name": "Kvarkki",
		"id": 1,
		"soundsLike": [
			"kvarkki"
		]
	},
	{
		"name": "Olivia",
		"id": 17,
		"soundsLike": [
			"olivia"
		]
	},
	{
		"name": "Rafla",
		"id": 22,
		"soundsLike": [
			"rafla"
		]
	},
	{
		"name": "Ravintola Fredrika Päärakennus",
		"id": 20,
		"soundsLike": [
			"ravintola fredrika päärakennus",
			"fredrika päärakennus",
			"päärakennus"
		]
	},
	{
		"name": "Ravintola Serpens",
		"id": 18,
		"soundsLike": [
			"ravintola serpens",
			"serpens"
		]
	},
	{
		"name": "Soc&Kom",
		"id": 25,
		"soundsLike": [
			"soc&kom",
			"soc kom",
			"soc ja kom"
		]
	},
	{
		"name": "Sähkötekniikka",
		"id": 6,
		"soundsLike": [
			"sähkötekniikka"
		]
	},
	{
		"name": "TUAS",
		"id": 7,
		"soundsLike": [
			"tuas"
		]
	},
	{
		"name": "Tietotekniikantalo",
		"id": 2,
		"soundsLike": [
			"tietotekniikantalo"
		]
	},
	{
		"name": "Tietotie 6",
		"id": 11,
		"soundsLike": [
			"tietotie 6",
			"tietotie kuusi"
		]
	},
	{
		"name": "Täffä",
		"id": 3,
		"soundsLike": [
			"täffä"
		]
	},
	{
		"name": "UniCafe Metsätalo",
		"id": 16,
		"soundsLike": [
			"unicafe metsätalo",
			"metsätalo"
		]
	},
	{
		"name": "UniCafe Päärakennus",
		"id": 19,
		"soundsLike": [
			"unicafe päärakennus",
			"päärakennus"
		]
	},
	{
		"name": "UniCafe Topelias",
		"id": 21,
		"soundsLike": [
			"unicafe topelias",
			"topelias"
		]
	},
	{
		"name": "UniCafe Ylioppilasaukio",
		"id": 12,
		"soundsLike": [
			"unicafe ylioppilasaukio",
			"ylioppilasaukio"
		]
	}
	]
	}

	getClosestMatch(str) {
		var bestMatch = Infinity;
		var index = -1;
		for (let i = 0; i < this.phonemes.length; i++) {
			for (let j = 0; j < this.phonemes[i].soundsLike.length; j++) {
				let lDistance = distance(str, this.phonemes[i].soundsLike[j]);
				if ( lDistance < bestMatch ){
					bestMatch = lDistance;
					index = i;
				}
			}
		}
		return {
			"id" : this.phonemes[index].id,
			"name" : this.phonemes[index].name
		};
	}


}