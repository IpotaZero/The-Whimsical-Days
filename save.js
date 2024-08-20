const Stage = class {
    constructor(difficulty_num) {
        this.difficulties = []

        for (let i = 0; i < difficulty_num; i++) {
            this.difficulties[i] = new Difficulty()
        }
    }
}

const Difficulty = class {
    constructor() {
        this.is_cleard = false
        this.highest_score = 0
        this.is_no_miss_cleard = false
    }

    set_highest_score(new_score) {
        this.highest_score = Math.max(this.highest_score, new_score)
    }
}

const Save = class {
    constructor(difficulty_nums) {
        this.stages = []

        for (let i = 0; i < difficulty_nums.length; i++) {
            this.stages[i] = new Stage(difficulty_nums[i])
        }
    }
}

const default_save = new Save([1, 4, 4, 1])

const save = new LocalStorage("save", default_save)
