
// SPELLの実装方針としてHP回復系は実装しない(別ゲーで敵/味方問わず戦闘中の回復がゲーム体験に悪影響と感じたため)
// 味方のHP回復系はアイテムで実装して短期決戦を促す
// 同様の理由でdebuff系も実装しない
// SPELLの数は100を目処として実装する(一通り実装してからゲーム体験が悪くなるものをコメントアウトしていく)
// スペル中心のゲームになるだろうからスペル全般テストコード必要
// コードの行数が多くなるので、スペルの実装は別ファイルに分けるかも
let SPELLS = { // プレイヤーが所持するスペル
};

const ULT_SPELLS = { // テスト済みのスペル
    tradeHpMp: { name: '変換', cost: 0, type: 'other', range: 'single', val: [0, 0],
requiredJobs: { 戦士: 2, 白魔法士: 2 },
        effect: (target, source) => {const tempHp = target.hp;target.hp = target.mp;target.mp = tempHp;logWrite(`${target.name}のHPとMPが入れ替わった!!`) } },
    tradeHpMpAll: { name: '全員変換', cost: 0, type: 'other', range: 'all', val: [0, 0],
requiredJobs: { 戦士: 2, 白魔法士: 2 },
        effect: (target, source) => {
            heroes.forEach(hero => {
                const tempHp = hero.hp;
                hero.hp = hero.mp;
                hero.mp = tempHp;
                logWrite(`${hero.name}のHPとMPが入れ替わった!!`);
            }); // 味方全員のHPとMPを入れ替えるスペル
        } },
    tradeMp: { name: 'MP変換', cost: 0, type: 'other', range: 'single', val: [0, 0],
requiredJobs: { 戦士: 2, 白魔法士: 2 }, effect: (target, source) => {     // 敵単体のMPを自分のMPと入れ替えるスペル
        const tempMp = target.mp;target.mp = source.mp;source.mp = tempMp;
        logWrite(`${source.name}は${target.name}のMPと入れ替えた!!`) } },
    tradeMaxMp: { name: '最大MP変換', cost: 0, type: 'other', range: 'single', val: [0, 0],
requiredJobs: { 戦士: 2, 白魔法士: 2 }, effect: (target, source) => {     // 敵単体の最大MPを自分のMPと入れ替えるスペル
        const tempMp = target.maxMp;target.maxMp = source.mp;source.mp = tempMp;logWrite(`${source.name}は${target.name}の最大MPと入れ替えた!!`) } },
    tradeMpAll: { name: '全員MP変換', cost: 0, type: 'other', range: 'all', val: [0, 0],
requiredJobs: { 戦士: 2, 白魔法士: 2 }, effect: (target, source) => {     // 敵全体のMPの累計を自分のMPにするスペル
        const totalMp = target.reduce((sum, enemy) => sum + enemy.mp, 0);source.mp = totalMp;logWrite(`${source.name}は${target.map(e => e.name).join(',')}のMPを合計(${totalMp})分得た!!`) } },
    tradeMaxMpAll: { name: '全員最大MP変換', cost: 0, type: 'other', range: 'all', val: [0, 0],
requiredJobs: { 戦士: 2, 白魔法士: 2 }, effect: (target, source) => {     // 敵全体の最大MPの累計を自分のMPにするスペル
        const totalMaxMp = target.reduce((sum, enemy) => sum + enemy.maxMp, 0);source.mp = totalMaxMp;logWrite(`${source.name}は${target.map(e => e.name).join(',')}の最大MPを合計(${totalMaxMp})にした!!`) } },
    tradeMpByStr: { name: 'MP変換(バフ)', cost: 0, type: 'other', range: 'single', val: [0, 0],
requiredJobs: { 戦士: 2, 白魔法士: 2 },effect: (target, source) => {     // 敵単体のMPを自分のbuffs.strにするスペル
        const tempMp = target.mp;target.mp = source.buffs.str;source.buffs.str = tempMp;logWrite(`${source.name}は${target.name}のMPとバフを入れ替えた!!`) } },
    tradeMaxMpByStr: { name: '最大MP変換(バフ)', cost: 0, type: 'other', range: 'single', val: [0, 0],
requiredJobs: { 戦士: 2, 白魔法士: 2 }, effect: (target, source) => {     // 敵単体の最大MPを自分のbuffs.strにするスペル
        const tempMp = target.maxMp;target.maxMp = source.buffs.str;source.buffs.str = tempMp;logWrite(`${source.name}は${target.name}の最大MPとバフを入れ替えた!!`) } },
    tradeMpAllByStr: { name: '全員MP変換(バフ)', cost: 0, type: 'other', range: 'all', val: [0, 0],
requiredJobs: { 戦士: 2, 白魔法士: 2 }, effect: (target, source) => {     // 敵全体のMPの累計を自分のbuffs.strにするスペル
        const totalMp = target.reduce((sum, enemy) => sum + enemy.mp, 0);source.buffs.str = totalMp;logWrite(`${source.name}は${target.map(e => e.name).join(',')}のMPを合計(${totalMp})分にした!!`) } },
    buffStrByEnemyCount: { name: '敵の数分Strバフ', cost: 0, type: 'buff', range: 'single', val: [0, 0],
requiredJobs: { 戦士: 2, 白魔法士: 2 }, effect: (target, source) => {     // 敵全体の数だけ自分のbuffs.strを上昇するスペル
        const buffAmount = target.length;source.buffs.str += buffAmount;logWrite(`${source.name}は${target.map(e => e.name).join(',')}の数(${buffAmount})分のバフをかけた!!`) } },
    buffStrByEnemyCount2: { name: '敵の数分全員Strバフ', cost: 0, type: 'buff', range: 'all', val: [0, 0],
requiredJobs: { 戦士: 2, 白魔法士: 2 }, effect: (target, source) => {     // 敵全体の数だけ味方全員のbuffs.strを上昇するスペル
        const buffAmount = enemies.length
        for (let i = 0; i < heroes.length; i++) {heroes[i].buffs.str += buffAmount;}
        logWrite(`${source.name}は味方全員の数(${buffAmount})分のバフをかけた!!`) } },

    // 実行したキャラクタに対象からMPを吸収する
    drainMp: { name: 'MP吸収', cost: 0, type: 'other', range: 'single', val: [0, 0],
requiredJobs: { 戦士: 2, 白魔法士: 2 },
    effect: (target, source) => {const drainAmount = Math.floor(target.mp * 0.5);target.mp -= drainAmount;source.mp += drainAmount;logWrite(`${source.name}が${target.name}からMPを吸収した!!`) } },
    // 選択した敵と同じモンスター1体を味方に召喚するスペル
    summonSameMonster: { name: '同じモンスター召喚', cost: 0, type: 'summon', range: 'single', val: [0, 0],
requiredJobs: { 戦士: 2, 白魔法士: 2 }, 
        effect: (target, caster) => {
            const monster = ENEMY_LIST.find(e => e.name === target.name);
            if (monster) {
                const summonedHero = createHero(monster.name, '戦士');
                summonedHero.hp = summonedHero.maxHp;
                summonedHero.mp = summonedHero.maxMp;
                summonedHero.learnedSpells = [];
                heroes.push(summonedHero);
                logWrite(`召喚を唱えた！${summonedHero.name}が味方になった!!`);
            } else {
                logWrite(`召喚に失敗した！`);
            }
        } 
    },
    // 味方にランダムでモンスターを召喚するスペル
    summonRandomMonster: { name: '適当召喚', cost: 0, type: 'summon', range: null, val: [0, 0],
requiredJobs: { 戦士: 2, 白魔法士: 2 }, 
        effect: (caster) => {
            const monster = ENEMY_LIST[rand(0, ENEMY_LIST.length - 1)];
            // ヒーローとして追加（職業は"戦士"など適宜）
            const summonedHero = createHero(monster.name, '戦士');
            summonedHero.hp = summonedHero.maxHp;
            summonedHero.mp = summonedHero.maxMp;
            summonedHero.learnedSpells = [];
            heroes.push(summonedHero);
            logWrite(`召喚を唱えた！${summonedHero.name}が味方になった!!`);
        } 
    },
    // 味方の平均レベルに近いモンスターを召喚するスペル
    summonNormalMonster: { name: '普通召喚', cost: 0, type: 'summon', range: null, val: [0, 0],
requiredJobs: { 戦士: 2, 白魔法士: 2 }, 
        effect: (target, caster) => {
            const averageLevel = Math.round(heroes.reduce((sum, hero) => sum + hero.level, 0) / heroes.length);
            let similarLevelEnemies = ENEMY_LIST.filter(e => Math.abs(e.level - averageLevel) <= 1);
            if (similarLevelEnemies.length === 0) similarLevelEnemies = ENEMY_LIST;
            const monster = similarLevelEnemies[rand(0, similarLevelEnemies.length - 1)];
            const summonedHero = createHero(monster.name, '戦士');
            summonedHero.hp = summonedHero.maxHp;
            summonedHero.mp = summonedHero.maxMp;
            summonedHero.learnedSpells = [];
            heroes.push(summonedHero);
            logWrite(`召喚を唱えた！${summonedHero.name}が味方になった!!`);
        } 
    },
    // 味方の平均レベルに近いモンスターを味方の最大数まで召喚するスペル
    summonAllies: { name: '最大召喚', cost: 0, type: 'summon', range: null, val: [0, 0],
requiredJobs: { 戦士: 2, 白魔法士: 2 }, 
        effect: (target, caster) => {
            const averageLevel = Math.round(heroes.reduce((sum, hero) => sum + hero.level, 0) / heroes.length);
            let similarLevelEnemies = ENEMY_LIST.filter(e => Math.abs(e.level - averageLevel) <= 1);
            if (similarLevelEnemies.length === 0) similarLevelEnemies = ENEMY_LIST;
            for (let i = 0; i < MAX_HEROES - heroes.length; i++) {
                const monster = similarLevelEnemies[rand(0, similarLevelEnemies.length - 1)];
                const summonedHero = createHero(monster.name, '戦士');
                summonedHero.hp = summonedHero.maxHp;
                summonedHero.mp = summonedHero.maxMp;
                summonedHero.learnedSpells = [];
                heroes.push(summonedHero);
                logWrite(`召喚を唱えた！${summonedHero.name}が味方になった!!`);
            }
            // MAX_HEROESに満たない場合は、残りをsimilarLevelEnemiesからランダムに召喚
            const remainingCount = MAX_HEROES - heroes.length;
            for (let i = 0; i < remainingCount; i++) {
                const monster = similarLevelEnemies[rand(0, similarLevelEnemies.length - 1)];
                const summonedHero = createHero(monster.name, '戦士');
                summonedHero.hp = summonedHero.maxHp;
                summonedHero.mp = summonedHero.maxMp;
                summonedHero.learnedSpells = [];
                heroes.push(summonedHero);
                logWrite(`召喚を唱えた！${summonedHero.name}が味方になった!!`);
            }

        } 
    },

};


