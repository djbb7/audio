// Levenshtein distance based on algorithms found at
// https://en.wikibooks.org/wiki/Algorithm_Implementation/Strings/Levenshtein_distance
export default function distance(s, t) {
	if (s.length === 0) return t.length;
	if (t.length === 0) return s.length;

	let dist = [];

	for (let i = 0; i <= s.length; i++) {
		dist[i] = [i];
	}

	for (let j = 0; j <= t.length; j++) {
		dist[0][j] = j;
	}

	for (let i = 1; i <= s.length; i++) {
		for (let j = 1; j <= t.length; j++) {
			if (s.charAt(i-1) === t.charAt(j-1)) {
				dist[i][j] = dist[i-1][j-1];
			} else {
				dist[i][j] = Math.min(dist[i-1][j-1] + 1,
																Math.min(dist[i-1][j] + 1,
																				 dist[i][j-1] + 1));
			}
		}
	}

	return dist[s.length][t.length];
}