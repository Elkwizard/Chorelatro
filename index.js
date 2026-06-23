const $ = query => document.querySelector(query);
const $$ = query => document.querySelectorAll(query);
const make = (tag, content) => {
	const result = document.createElement(tag);
	if (content !== undefined) result.textContent = content;
	return result;
};

const people = ["H", "Quinn", "Maya"];

const rng = {
	seed: 1234,
	random() {
		this.seed += 1e5;
		const a = (this.seed * 638835776.12849) % 8.7890975;
		const b = (a * 256783945.4758903) % 2.567890;
		const r = Math.abs(a * b * 382749.294873597) % 1;
		return r;
	},
	chance(chance = 0.5) {
		return this.random() < chance;
	},
	choice(array) {
		return array[this.index(array)];
	},
	index(array) {
		return Math.floor(array.length * this.random());
	},
	shuffle(array) {
		for (let i = 0; i < array.length; i++) {
			const inxA = this.index(array);
			const inxB = this.index(array);
			const temp = array[inxA];
			array[inxA] = array[inxB];
			array[inxB] = temp;
		}

		return array;
	}
};

const startDate = new Date("9/24/2025");

const chores = [
	"Unload Dishwasher",
	"Sweep Floor",
	"Clean Counters",
	"Clean Stove",
	"Vacuum Couch",
	"Take out Trash",
	"Mop Floors"
];

const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

const residents = people.filter(person => person !== "Maya");
const gamblers = ["H", "Quinn"];

const next = {
	H: "Quinn",
	// Jake: "Quinn",
	Quinn: "H"
};

const computeChores = () => {
	rng.seed = 12345;
	
	const rotations = Math.ceil((new Date() - startDate) / MS_PER_WEEK);

	const tiledResidents = new Array(Math.ceil(chores.length / residents.length) * residents.length)
		.fill()
		.map((_, i) => residents[i % residents.length]);

	const assignments = new Map(
		rng.shuffle(tiledResidents)
			.map((person, i) => [chores[i], [person]])
	);

	const CHUNK = people.length;
	const computedRotations = Math.ceil(rotations / CHUNK) * CHUNK;
	for (let i = 0; i < computedRotations; i++)
		for (const people of assignments.values())
			people.push(next[people.at(-1)]);

	for (let i = 0; i < computedRotations; i += CHUNK) {
		for (const assigned of assignments.values()) {
			const gamblerIndices = assigned
				.map((_, i) => i)
				.slice(i, i + CHUNK)
				.filter(index => gamblers.includes(assigned[index]));
			const order = gamblerIndices.map(index => assigned[index]);
			rng.shuffle(gamblerIndices);
			for (let j = 0; j < gamblerIndices.length; j++)
				assigned[gamblerIndices[j]] = order[j];

			for (let j = 0; j < CHUNK; j++)
				if (rng.chance(1 / 24))
					assigned[i + j] = "Maya";
		}
	}

	

	const mapping = new Map(people.map(person => [person, []]));
	
	for (const [chore, people] of assignments)
		mapping.get(people[rotations - 1]).push(chore);
	
	return mapping;
};

const refresh = () => {
	const mapping = computeChores();

	const wrapper = $("#people");
	wrapper.innerHTML = "";
	for (const name of people) {
		const chores = make("div");
		chores.appendChild(make("h2", name));
		const choreBox = make("div");
		for (const chore of mapping.get(name))
			choreBox.appendChild(make("div", chore));
		chores.appendChild(choreBox);

		wrapper.appendChild(chores);
	}
};

addEventListener("load", refresh);

setInterval(refresh, 500);