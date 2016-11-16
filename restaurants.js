import distance from './distance'
import restaurants from './restaurants.json'
import _ from 'lodash';

export default class {

	getClosestMatch(input) {
		return _.minBy(restaurants, restaurant => _.min(
			restaurant.soundsLike.map(sound => distance(input, sound))
		));
	}
	
}