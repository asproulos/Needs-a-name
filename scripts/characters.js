class Tags {
    /** 
     * @typedef {{
     *  thorns: number,
     *  healBoost: number,
     *  shieldBoost: number,
     *  weaken: number
     * }} TagsOptions
     */
    #defaultOptions = {
        thorns: 0,
        healBoost: 0,
        shieldBoost: 0,
        weaken: 0
    }

    /**
     * @param {TagsOptions} options 
     */
    constructor(options) {
        if (!options) {
            options = this.#defaultOptions;
        }

        this.thorns = isNaN(parseInt(options.thorns)) ? 0 : parseInt(options.thorns);
        this.healBoost = isNaN(parseInt(options.healBoost)) ? 0 : parseInt(options.healBoost);
        this.shieldBoost = isNaN(parseInt(options.shieldBoost)) ? 0 : parseInt(options.shieldBoost);
        this.weaken = isNaN(parseInt(options.weaken)) ? 0 : parseInt(options.weaken);
    }



    /**
     * @returns {ActionOptions} 
     */
    parseOptions = (options) => {
        if (!options) options = {};

        if (typeof options.thorns !== "number") options.thorns = this.#defaultOptions.thorns;
        if (typeof options.healBoost !== "number") options.healBoost = this.#defaultOptions.healBoost;
        if (typeof options.shieldBoost !== "number") options.shieldBoost = this.#defaultOptions.shieldBoost;
        if (typeof options.weaken !== "number") options.weaken = this.#defaultOptions.weaken;

        return options;
    }
}

class Action {
    /** 
     * @typedef {{
     *  type: "damage" | "heal" | "shield" | "effect",
     *  strength: number
     *  tags: Tags
     * }} ActionOptions
     */
    #defaultOptions = {
        type: "damage",
        strength: 1,
        tags: new Tags()
    }

    /**
     * @param {ActionOptions} options 
     */
    constructor(options) {
        options = this.parseOptions(options);

        this.type = options.type;
        this.strength = options.strength;
        this.tags = options.tags;
    }

    /**
     * @param {Character} source 
     * @param {Character} target 
     */
    apply = (source, target) => {
        let effect = target[this.type];
        if (effect && typeof effect === "function") {
            effect(this.strength, { source: source, type: this.type })
        }
    }

    /**
     * @returns {ActionOptions} 
     */
    parseOptions = (options) => {
        if (!options) options = {};

        if (typeof options.type !== "string") options.type = this.#defaultOptions.type;
        if (typeof options.strength !== "number") {
            if (isNaN(parseInt(options.strength)))
                options.strength = this.#defaultOptions.strength;
            else
                options.strength = parseInt(options.strength);
        }
        if (!(options.tags instanceof Tags)) options.tags = this.#defaultOptions.tags;

        return options;
    }
}

class Character {
    /** 
     * @typedef {{
     *  name: string,
     *  image: string,
     *  dom: HTMLElement | null,
     *  maxHealth: number,
     *  tags: Tags,
     *  actions: Array<Action>
     * }} CharacterOptions
     */
    #defaultOptions = {
        name: "No name",
        image: "",
        dom: null,
        maxHealth: 5,
        tags: new Tags(),
        actions: [],
    }

    /**
     * @param {CharacterOptions} options 
     */
    constructor(options) {
        this.parseOptions(options);

        // Visual properties
        this.name = options.name;
        this.image = options.image;
        this.dom = options.dom;

        // Game properties
        this.maxHealth = options.maxHealth;
        this.currentHealth = options.maxHealth;
        this.shields = 0;
        this.tags = options.tags;
        this.actions = options.actions;
    }

    /**
     * @param {number} amount 
     * @param {{
     *  source: Character,
     *  skipEffects: boolean
     * }} extra 
     */
    damage = (amount, extra) => {
        this.shields -= amount;
        if (this.shields < 0) {
            this.currentHealth += this.shields;
            this.shields = 0;
        }
        if (extra.skipEffects) return;

        if (this.tags.thorns) extra.source.damage(this.tags.thorns, { source: this, skipEffects: true });
        if (this.tags.weaken) this.currentHealth -= this.tags.weaken;
    }

    /**
     * @param {number} amount 
     * @param {{
     *  source: Character
     *  skipEffects: boolean
     * }} extra 
     */
    heal = (amount, extra) => {
        this.currentHealth += amount;
        if (this.currentHealth > this.maxHealth) this.currentHealth = this.maxHealth;
        if (extra.skipEffects) return;


    }

    /**
     * @param {number} amount 
     * @param {{
     *  source: Character
     *  skipEffects: boolean
     * }} extra 
     */
    shield = (amount, extra) => {
        this.shields += amount;
        if (extra.skipEffects) return;

    }

    /**
     * @param {number} amount  
     * @param {{
     *  source: Character,
     *  skipEffects: boolean
     *  type: string
     * }} extra 
     */
    effect = (amount, extra) => {

        if (extra.skipEffects) return;
    }

    /**
     * @returns {CharacterOptions} 
     */
    parseOptions = (options) => {
        if (!options) options = {};

        if (typeof options.name !== "string") options.name = this.#defaultOptions.name;
        if (typeof options.image !== "string") options.image = this.#defaultOptions.image;
        if (!(options.dom instanceof HTMLElement)) options.dom = this.#defaultOptions.dom;

        if (typeof options.maxHealth !== "number") {
            if (isNaN(parseInt(options.maxHealth)))
                options.maxHealth = this.#defaultOptions.maxHealth;
            else
                options.maxHealth = parseInt(options.maxHealth);
        }
        if (!(options.tags instanceof Tags)) options.tags = this.#defaultOptions.tags;
        if (!(options.actions instanceof Array)) options.actions = this.#defaultOptions.actions;

        return options;
    }
}