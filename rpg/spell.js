
// SPELLの実装方針としてHP回復系は実装しない(別ゲーで敵/味方問わず戦闘中の回復がゲーム体験に悪影響と感じたため)
// 味方のHP回復系はアイテムで実装して短期決戦を促す
// 同様の理由でdebuff系も実装しない
// SPELLの数は100を目処として実装する(一通り実装してからゲーム体験が悪くなるものをコメントアウトしていく)
// スペル中心のゲームになるだろうからスペル全般テストコード必要
// コードの行数が多くなるので、スペルの実装は別ファイルに分けるかも
let SPELLS = { // プレイヤーが所持するスペル
};

const ULT_SPELLS = { // テスト済みのスペル
    tradeHpMp: { name: '変換', cost: 0, type: 'other', range: 'single', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 },
        effect: (target, source) => {const tempHp = target.hp;target.hp = target.mp;target.mp = tempHp;logWrite(`${target.name}のHPとMPが入れ替わった!!`) } },
    tradeHpMpAll: { name: '全員変換', cost: 0, type: 'other', range: 'all', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 },
        effect: (target, source) => {
            heroes.forEach(hero => {
                const tempHp = hero.hp;
                hero.hp = hero.mp;
                hero.mp = tempHp;
                logWrite(`${hero.name}のHPとMPが入れ替わった!!`);
            }); // 味方全員のHPとMPを入れ替えるスペル
        } },
    tradeMp: { name: 'MP変換', cost: 0, type: 'other', range: 'single', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, effect: (target, source) => {     // 敵単体のMPを自分のMPと入れ替えるスペル
        const tempMp = target.mp;target.mp = source.mp;source.mp = tempMp;
        logWrite(`${source.name}は${target.name}のMPと入れ替えた!!`) } },
    tradeMaxMp: { name: '最大MP変換', cost: 0, type: 'other', range: 'single', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, effect: (target, source) => {     // 敵単体の最大MPを自分のMPと入れ替えるスペル
        const tempMp = target.maxMp;target.maxMp = source.mp;source.mp = tempMp;logWrite(`${source.name}は${target.name}の最大MPと入れ替えた!!`) } },
    tradeMpAll: { name: '全員MP変換', cost: 0, type: 'other', range: 'all', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, effect: (target, source) => {     // 敵全体のMPの累計を自分のMPにするスペル
        const totalMp = target.reduce((sum, enemy) => sum + enemy.mp, 0);source.mp = totalMp;logWrite(`${source.name}は${target.map(e => e.name).join(',')}のMPを合計(${totalMp})分得た!!`) } },
    tradeMaxMpAll: { name: '全員最大MP変換', cost: 0, type: 'other', range: 'all', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, effect: (target, source) => {     // 敵全体の最大MPの累計を自分のMPにするスペル
        const totalMaxMp = target.reduce((sum, enemy) => sum + enemy.maxMp, 0);source.mp = totalMaxMp;logWrite(`${source.name}は${target.map(e => e.name).join(',')}の最大MPを合計(${totalMaxMp})にした!!`) } },
    tradeMpByStr: { name: 'MP変換(バフ)', cost: 0, type: 'other', range: 'single', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 },effect: (target, source) => {     // 敵単体のMPを自分のbuffs.strにするスペル
        const tempMp = target.mp;target.mp = source.buffs.str;source.buffs.str = tempMp;logWrite(`${source.name}は${target.name}のMPとバフを入れ替えた!!`) } },
    tradeMaxMpByStr: { name: '最大MP変換(バフ)', cost: 0, type: 'other', range: 'single', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, effect: (target, source) => {     // 敵単体の最大MPを自分のbuffs.strにするスペル
        const tempMp = target.maxMp;target.maxMp = source.buffs.str;source.buffs.str = tempMp;logWrite(`${source.name}は${target.name}の最大MPとバフを入れ替えた!!`) } },
    tradeMpAllByStr: { name: '全員MP変換(バフ)', cost: 0, type: 'other', range: 'all', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, effect: (target, source) => {     // 敵全体のMPの累計を自分のbuffs.strにするスペル
        const totalMp = target.reduce((sum, enemy) => sum + enemy.mp, 0);source.buffs.str = totalMp;logWrite(`${source.name}は${target.map(e => e.name).join(',')}のMPを合計(${totalMp})分にした!!`) } },
    buffStrByEnemyCount: { name: '敵の数分Strバフ', cost: 0, type: 'buff', range: 'single', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, effect: (target, source) => {     // 敵全体の数だけ自分のbuffs.strを上昇するスペル
        const buffAmount = target.length;source.buffs.str += buffAmount;logWrite(`${source.name}は${target.map(e => e.name).join(',')}の数(${buffAmount})分のバフをかけた!!`) } },
    buffStrByEnemyCount2: { name: '敵の数分全員Strバフ', cost: 0, type: 'buff', range: 'all', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, effect: (target, source) => {     // 敵全体の数だけ味方全員のbuffs.strを上昇するスペル
        const buffAmount = enemies.length
        for (let i = 0; i < heroes.length; i++) {heroes[i].buffs.str += buffAmount;}
        logWrite(`${source.name}は味方全員の数(${buffAmount})分のバフをかけた!!`) } },

    // 実行したキャラクタに対象からMPを吸収する
    drainMp: { name: 'MP吸収', cost: 0, type: 'other', range: 'single', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 },
    effect: (target, source) => {const drainAmount = Math.floor(target.mp * 0.5);target.mp -= drainAmount;source.mp += drainAmount;logWrite(`${source.name}が${target.name}からMPを吸収した!!`) } },
    // 選択した敵と同じモンスター1体を味方に召喚するスペル
    summonSameMonster: { name: '同じモンスター召喚', cost: 0, type: 'summon', range: 'single', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, 
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
    summonRandomMonster: { name: '適当召喚', cost: 0, type: 'summon', range: null, val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, 
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
    summonNormalMonster: { name: '普通召喚', cost: 0, type: 'summon', range: null, val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, 
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
    summonAllies: { name: '最大召喚', cost: 0, type: 'summon', range: null, val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, 
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

const UNCHECKED_SPELLS = {// 未テストのスペルを管理するオブジェクト
    // 味方全体の数だけ自分のbuffs.strを上昇するスペル
    buffStrByAllCount: { name: '全員の数分Strバフ', cost: 0, type: 'buff', range: 'single', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, effect: (target, source) => {
        const buffAmount = heroes.length + enemies.length; // 味方全体の数 + 敵全体の数
        source.buffs.str += buffAmount;logWrite(`${source.name}は味方全員の数(${buffAmount})分のバフをかけた!!`) } },
    // 味方全体の数だけ味方全員のbuffs.strを上昇するスペル
    buffStrByAllCount2: { name: '全員の数分全員Strバフ', cost: 0, type: 'buff', range: 'all', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, effect: (target, source) => {
        const buffAmount = target.length;for (let i = 0; i < heroes.length; i++) {heroes[i].buffs.str += buffAmount;}logWrite(`${source.name}は味方全員の数(${buffAmount})分のバフをかけた!!`) } },
    // 敵と味方の全体の合計数だけ自分のbuffs.strを上昇するスペル
    buffStrByAllCount3: { name: '全員の数分Strバフ(敵味方)', cost: 0, type: 'buff', range: 'single', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, effect: (target, source) => {
        const buffAmount = target.length + enemies.length;source.buffs.str += buffAmount;logWrite(`${source.name}は敵と味方全員の数(${buffAmount})分のバフをかけた!!`) } },
    // 敵と味方の全体の合計数だけ味方全員のbuffs.strを上昇するスペル
    buffStrByAllCount4: { name: '全員の数分全員Strバフ(敵味方)', cost: 0, type: 'buff', range: 'all', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, effect: (target, source) => {
        const buffAmount = target.length + enemies.length;for (let i = 0; i < heroes.length; i++) {heroes[i].buffs.str += buffAmount;}logWrite(`${source.name}は敵と味方全員の数(${buffAmount})分のバフをかけた!!`) } },
    // 所持するアイテムの数だけ単体の味方のbuffs.strを上昇するスペル
    buffStrByItemCount: { name: 'アイテムの数分Strバフ', cost: 0, type: 'buff', range: 'single', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, effect: (target, source) => {
        const buff_target = target[0];
        const buffAmount = INVENTORY ? Object.keys(INVENTORY).length : 0; // 所持アイテムの数を取得
        buff_target.buffs.str += buffAmount;logWrite(`${source.name}は${buff_target.name}にアイテム(${buffAmount})分のバフをかけた!!`) } },
    // 所持するアイテムの数だけ味方全員のbuffs.strを上昇するスペル
    buffStrByItemCount2: { name: 'アイテムの数分全員Strバフ', cost: 0, type: 'buff', range: 'all', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, effect: (target, source) => {
        const buffAmount = INVENTORY ? Object.keys(INVENTORY).length : 0; // 所持アイテムの数を取得
        for (let i = 0; i < heroes.length; i++) {heroes[i].buffs.str += buffAmount;}logWrite(`${source.name}は味方全員にアイテム(${buffAmount})分のバフをかけた!!`) } },
    // 戦闘回数*10だけ単体の味方のbuffs.strを上昇するスペル
    buffStrByBattleCount: { name: '戦闘回数分Strバフ', cost: 0, type: 'buff', range: 'single', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, effect: (target, source) => {
        const buff_target = target[0];
        const buffAmount = battleCount * 10;buff_target.buffs.str += buffAmount;logWrite(`${source.name}は${buff_target.name}に戦闘回数(${buffAmount})分のバフをかけた!!`) } },
    // 戦闘回数*10だけ味方全員のbuffs.strを上昇するスペル
    buffStrByBattleCount2: { name: '戦闘回数分全員Strバフ', cost: 0, type: 'buff', range: 'all', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, effect: (target, source) => {
        const buffAmount = battleCount * 10;for (let i = 0; i < heroes.length; i++) {heroes[i].buffs.str += buffAmount;}logWrite(`${source.name}は味方全員に戦闘回数(${buffAmount})分のバフをかけた!!`) } },
    // 戦闘回数*100だけ単体の味方のbuffs.strを上昇するスペル
    buffStrByBattleCount3: { name: '戦闘回数分Strバフ(100倍)', cost: 0, type: 'buff', range: 'single', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, effect: (target, source) => {
        const buff_target = target[0];
        const buffAmount = battleCount * 100;buff_target.buffs.str += buffAmount;logWrite(`${source.name}は${buff_target.name}に戦闘回数(${buffAmount})分のバフをかけた!!`) } },
    // 戦闘回数*100だけ味方全員のbuffs.strを上昇するスペル
    buffStrByBattleCount4: { name: '戦闘回数分全員Strバフ(100倍)', cost: 0, type: 'buff', range: 'all', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, effect: (target, source) => {
        const buffAmount = battleCount * 100;for (let i = 0; i < heroes.length; i++) {heroes[i].buffs.str += buffAmount;}logWrite(`${source.name}は味方全員に戦闘回数(${buffAmount})分のバフをかけた!!`) } },
    // 敵1体をランダムな別のenemyに入れ替えるスペル
    tradeEnemyRandom: { name: '敵を入れ替え(ランダム)', cost: 0, type: 'other', range: 'single', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, effect: (target, source) => {
        const randomIndex = Math.floor(Math.random() * enemies.length);
        const temp = target[0];target[0] = enemies[randomIndex];enemies[randomIndex] = temp;logWrite(`${source.name}は${target[0].name}と${enemies[randomIndex].name}を入れ替えた!!`) } },
    // 敵全てをランダムな別のenemyに入れ替えるスペル
    tradeEnemyAllRandom: { name: '敵を入れ替え(全員ランダム)', cost: 0, type: 'other', range: 'all', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, effect: (target, source) => {
        for (let i = 0; i < target.length; i++) {
            const randomIndex = Math.floor(Math.random() * enemies.length);
            const temp = target[i];target[i] = enemies[randomIndex];enemies[randomIndex] = temp;
        }logWrite(`${source.name}は${target.map(e => e.name).join(',')}と${enemies.map(e => e.name).join(',')}を入れ替えた!!`) } },
    // 敵単体が持つbuffs.strを自分のbuffs.strにするスペル
    tradeEnemyBuffStr: { name: '敵のバフを吸収', cost: 0, type: 'other', range: 'single', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, effect: (target, source) => {
        const temp = target[0].buffs.str;target[0].buffs.str = source.buffs.str;source.buffs.str = temp;logWrite(`${source.name}は${target[0].name}のバフを吸収した!!`) } },
    // 敵全体が持つbuffs.strを自分のbuffs.strにするスペル
    tradeEnemyBuffStrAll: { name: '全員のバフを吸収', cost: 0, type: 'other', range: 'all', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, effect: (target, source) => {
        for (let i = 0; i < target.length; i++) {
            const temp = target[i].buffs.str;target[i].buffs.str = source.buffs.str;source.buffs.str = temp;
        }logWrite(`${source.name}は${target.map(e => e.name).join(',')}のバフを吸収した!!`) } },
    // 敵全体が持つbuffs.strを味方全員のbuffs.strにするスペル
    tradeEnemyBuffStrAll2: { name: '全員のバフを吸収(全員)', cost: 0, type: 'other', range: 'all', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, effect: (target, source) => {
        for (let i = 0; i < target.length; i++) {
            const temp = target[i].buffs.str;target[i].buffs.str = heroes[i].buffs.str;heroes[i].buffs.str = temp;
        }logWrite(`${source.name}は${target.map(e => e.name).join(',')}のバフを吸収した!!`) } },
    // 味方全体の最大HPの平均数値を自分のbuffs.strにするスペル
    buffStrByAvgAllMaxHp: { name: '全員最大HP平均分Strバフ', cost: 0, type: 'buff', range: 'single', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, 
        effect: (target, source) => {
            const avgMaxHp = Math.floor(heroes.reduce((sum, h) => sum + h.maxHp, 0) / heroes.length);
            source.buffs.str += avgMaxHp;
            logWrite(`${source.name}は味方全員の最大HP平均(${avgMaxHp})分のバフをかけた!!`);
        } 
    },
    // 味方全体の最大HPの平均数値を味方全体のbuffs.strにするスペル
    buffStrByAvgAllMaxHp2: { name: '全員最大HP平均分全員Strバフ', cost: 0, type: 'buff', range: 'all', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, 
        effect: (target, source) => {
            const avgMaxHp = Math.floor(heroes.reduce((sum, h) => sum + h.maxHp, 0) / heroes.length);
            for (let i = 0; i < heroes.length; i++) {
                heroes[i].buffs.str += avgMaxHp;
            }
            logWrite(`${source.name}は味方全員の最大HP平均(${avgMaxHp})分のバフをかけた!!`);
        } 
    },
    // 味方全体の最大HPの平均数値を敵単体のHPの平均数値にするスペル
    buffEnemyHpByAvgAllMaxHp: { name: '全員最大HP平均分敵HPバフ', cost: 0, type: 'buff', range: 'single', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, 
        effect: (target, source) => {
            const avgMaxHp = Math.floor(heroes.reduce((sum, h) => sum + h.maxHp, 0) / heroes.length);
            const enemyTarget = target[0];
            enemyTarget.hp = avgMaxHp;
            logWrite(`${source.name}は${enemyTarget.name}のHPを味方全員の最大HP平均(${avgMaxHp})にした!!`);
        } 
    },
    // 味方全体の最大HPの平均数値を敵全体のHPの平均数値にするスペル
    buffEnemyHpByAvgAllMaxHp2: { name: '全員最大HP平均分敵HPバフ(全員)', cost: 0, type: 'buff', range: 'all', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, 
        effect: (target, source) => {
            const avgMaxHp = Math.floor(heroes.reduce((sum, h) => sum + h.maxHp, 0) / heroes.length);
            for (let i = 0; i < target.length; i++) {
                target[i].hp = avgMaxHp;
            }
            logWrite(`${source.name}は${target.map(e => e.name).join(',')}のHPを味方全員の最大HP平均(${avgMaxHp})にした!!`);
        } 
    },
    // 敵全体の最大HPの平均数値を自分のbuffs.strにするスペル
    buffStrByAvgAllEnemiesMaxHp: { name: '敵全員最大HP平均分Strバフ', cost: 0, type: 'buff', range: 'single', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, 
        effect: (target, source) => {
            const avgMaxHp = Math.floor(enemies.reduce((sum, e) => sum + e.maxHp, 0) / enemies.length);
            source.buffs.str += avgMaxHp;
            logWrite(`${source.name}は敵全員の最大HP平均(${avgMaxHp})分のバフをかけた!!`);
        } 
    },
    // 敵全体の最大HPの平均数値を味方全体のbuffs.strにするスペル
    buffStrByAvgAllEnemiesMaxHp2: { name: '敵全員最大HP平均分全員Strバフ', cost: 0, type: 'buff', range: 'all', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, 
        effect: (target, source) => {
            const avgMaxHp = Math.floor(enemies.reduce((sum, e) => sum + e.maxHp, 0) / enemies.length);
            for (let i = 0; i < heroes.length; i++) {
                heroes[i].buffs.str += avgMaxHp;
            }
            logWrite(`${source.name}は敵全員の最大HP平均(${avgMaxHp})分のバフをかけた!!`);
        } 
    },
    // 敵全体の最大HPの平均数値を敵単体のHPの平均数値にするスペル
    buffEnemyHpByAvgAllEnemiesMaxHp: { name: '敵全員最大HP平均分敵HPバフ', cost: 0, type: 'buff', range: 'single', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, 
        effect: (target, source) => {
            const avgMaxHp = Math.floor(enemies.reduce((sum, e) => sum + e.maxHp, 0) / enemies.length);
            const enemyTarget = target[0];
            enemyTarget.hp = avgMaxHp;
            logWrite(`${source.name}は${enemyTarget.name}のHPを敵全員の最大HP平均(${avgMaxHp})にした!!`);
        } 
    },
    // 敵全体の最大HPの平均数値を敵全体のHPの平均数値にするスペル
    buffEnemyHpByAvgAllEnemiesMaxHp2: { name: '敵全員最大HP平均分敵HPバフ(全員)', cost: 0, type: 'buff', range: 'all', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, 
        effect: (target, source) => {
            const avgMaxHp = Math.floor(enemies.reduce((sum, e) => sum + e.maxHp, 0) / enemies.length);
            for (let i = 0; i < target.length; i++) {
                target[i].hp = avgMaxHp;
            }
            logWrite(`${source.name}は${target.map(e => e.name).join(',')}のHPを敵全員の最大HP平均(${avgMaxHp})にした!!`);
        } 
    },
    // 味方全体のHPの平均数値を自分のbuffs.strにするスペル
    buffStrByAvgAllHp: { name: '全員HP平均分Strバフ', cost: 0, type: 'buff', range: 'single', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, 
        effect: (target, source) => {
            const avgHp = Math.floor(heroes.reduce((sum, h) => sum + h.hp, 0) / heroes.length);
            source.buffs.str += avgHp;
            logWrite(`${source.name}は味方全員のHP平均(${avgHp})分のバフをかけた!!`);
        } 
    },
    // 味方全体のHPの平均数値を味方全体のbuffs.strにするスペル
    buffStrByAvgAllHp2: { name: '全員HP平均分全員Strバフ', cost: 0, type: 'buff', range: 'all', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, 
        effect: (target, source) => {
            const avgHp = Math.floor(heroes.reduce((sum, h) => sum + h.hp, 0) / heroes.length);
            for (let i = 0; i < heroes.length; i++) {
                heroes[i].buffs.str += avgHp;
            }
            logWrite(`${source.name}は味方全員のHP平均(${avgHp})分のバフをかけた!!`);
        } 
    },
    // 味方全体のHPの平均数値を敵単体のHPの平均数値にするスペル
    buffEnemyHpByAvgAllHp: { name: '全員HP平均分敵HPバフ', cost: 0, type: 'buff', range: 'single', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, 
        effect: (target, source) => {
            const avgHp = Math.floor(heroes.reduce((sum, h) => sum + h.hp, 0) / heroes.length);
            const enemyTarget = target[0];
            enemyTarget.hp = avgHp;
            logWrite(`${source.name}は${enemyTarget.name}のHPを味方全員のHP平均(${avgHp})にした!!`);
        } 
    },
    // 味方全体のHPの平均数値を敵全体のHPの平均数値にするスペル
    buffEnemyHpByAvgAllHp2: { name: '全員HP平均分敵HPバフ(全員)', cost: 0, type: 'buff', range: 'all', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, 
        effect: (target, source) => {
            const avgHp = Math.floor(heroes.reduce((sum, h) => sum + h.hp, 0) / heroes.length);
            for (let i = 0; i < target.length; i++) {
                target[i].hp = avgHp;
            }
            logWrite(`${source.name}は${target.map(e => e.name).join(',')}のHPを味方全員のHP平均(${avgHp})にした!!`);
        } 
    },
    // 敵全体のHPの平均数値を自分のbuffs.strにするスペル
    buffStrByAvgAllEnemiesHp: { name: '敵全員HP平均分Strバフ', cost: 0, type: 'buff', range: 'single', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, 
        effect: (target, source) => {
            const avgHp = Math.floor(enemies.reduce((sum, e) => sum + e.hp, 0) / enemies.length);
            source.buffs.str += avgHp;
            logWrite(`${source.name}は敵全員のHP平均(${avgHp})分のバフをかけた!!`);
        } 
    },
    // 敵全体のHPの平均数値を味方全体のbuffs.strにするスペル
    buffStrByAvgAllEnemiesHp2: { name: '敵全員HP平均分全員Strバフ', cost: 0, type: 'buff', range: 'all', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, 
        effect: (target, source) => {
            const avgHp = Math.floor(enemies.reduce((sum, e) => sum + e.hp, 0) / enemies.length);
            for (let i = 0; i < heroes.length; i++) {
                heroes[i].buffs.str += avgHp;
            }
            logWrite(`${source.name}は敵全員のHP平均(${avgHp})分のバフをかけた!!`);
        } 
    },
    // 敵全体のHPの平均数値を敵単体のHPの平均数値にするスペル
    buffEnemyHpByAvgAllEnemiesHp: { name: '敵全員HP平均分敵HPバフ', cost: 0, type: 'buff', range: 'single', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, 
        effect: (target, source) => {
            const avgHp = Math.floor(enemies.reduce((sum, e) => sum + e.hp, 0) / enemies.length);
            const enemyTarget = target[0];
            enemyTarget.hp = avgHp;
            logWrite(`${source.name}は${enemyTarget.name}のHPを敵全員のHP平均(${avgHp})にした!!`);
        } 
    },
    // 敵全体のHPの平均数値を敵全体のHPの平均数値にするスペル
    buffEnemyHpByAvgAllEnemiesHp2: { name: '敵全員HP平均分敵HPバフ(全員)', cost: 0, type: 'buff', range: 'all', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, 
        effect: (target, source) => {
            const avgHp = Math.floor(enemies.reduce((sum, e) => sum + e.hp, 0) / enemies.length);
            for (let i = 0; i < target.length; i++) {
                target[i].hp = avgHp;
            }
            logWrite(`${source.name}は${target.map(e => e.name).join(',')}のHPを敵全員のHP平均(${avgHp})にした!!`);
        } 
    },
    // 味方全体の最大MPの平均数値を自分のbuffs.strにするスペル
    buffStrByAvgAllMaxMp: { name: '全員最大MP平均分Strバフ', cost: 0, type: 'buff', range: 'single', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 },
        effect: (target, source) => {
            const avgMaxMp = Math.floor(heroes.reduce((sum, h) => sum + h.maxMp, 0) / heroes.length);
            source.buffs.str += avgMaxMp;
            logWrite(`${source.name}は味方全員の最大MP平均(${avgMaxMp})分のバフをかけた!!`);
        }
    },
    // 味方全体の最大MPの平均数値を味方全体のbuffs.strにするスペル
    buffStrByAvgAllMaxMp2: { name: '全員最大MP平均分全員Strバフ', cost: 0, type: 'buff', range: 'all', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 },
        effect: (target, source) => {
            const avgMaxMp = Math.floor(heroes.reduce((sum, h) => sum + h.maxMp, 0) / heroes.length);
            for (let i = 0; i < heroes.length; i++) {
                heroes[i].buffs.str += avgMaxMp;
            }
            logWrite(`${source.name}は味方全員の最大MP平均(${avgMaxMp})分のバフをかけた!!`);
        }
    },
    // 味方全体の最大MPの平均数値を敵単体のHPの平均数値にするスペル
    buffEnemyHpByAvgAllMaxMp: { name: '全員最大MP平均分敵HPバフ', cost: 0, type: 'buff', range: 'single', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 },
        effect: (target, source) => {
            const avgMaxMp = Math.floor(heroes.reduce((sum, h) => sum + h.maxMp, 0) / heroes.length);
            const enemyTarget = target[0];
            enemyTarget.hp = avgMaxMp;
            logWrite(`${source.name}は${enemyTarget.name}のHPを味方全員の最大MP平均(${avgMaxMp})にした!!`);
        }
    },
    // 味方全体の最大MPの平均数値を敵全体のHPの平均数値にするスペル
    buffEnemyHpByAvgAllMaxMp2: { name: '全員最大MP平均分敵HPバフ(全員)', cost: 0, type: 'buff', range: 'all', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 },
        effect: (target, source) => {
            const avgMaxMp = Math.floor(heroes.reduce((sum, h) => sum + h.maxMp, 0) / heroes.length);
            for (let i = 0; i < target.length; i++) {
                target[i].hp = avgMaxMp;
            }
            logWrite(`${source.name}は${target.map(e => e.name).join(',')}のHPを味方全員の最大MP平均(${avgMaxMp})にした!!`);
        }
    },
    // 敵全体の最大MPの平均数値を自分のbuffs.strにするスペル
    buffStrByAvgAllEnemiesMaxMp: { name: '敵全員最大u@ 456hgfdMP平均分Strバフ', cost: 0, type: 'buff', range: 'single', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 },
        effect: (target, source) => {
            const avgMaxMp = Math.floor(enemies.reduce((sum, e) => sum + e.maxMp, 0) / enemies.length);
            source.buffs.str += avgMaxMp;
            logWrite(`${source.name}は敵全員の最大MP平均(${avgMaxMp})分のバフをかけた!!`);
        }
    },
    // 敵全体の最大MPの平均数値を味方全体のbuffs.strにするスペル
    buffStrByAvgAllEnemiesMaxMp2: { name: '敵全員最大MP平均分全員Strバフ', cost: 0, type: 'buff', range: 'all', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 },
        effect: (target, source) => {
            const avgMaxMp = Math.floor(enemies.reduce((sum, e) => sum + e.maxMp, 0) / enemies.length);
            for (let i = 0; i < heroes.length; i++) {
                heroes[i].buffs.str += avgMaxMp;
            }
            logWrite(`${source.name}は敵全員の最大MP平均(${avgMaxMp})分のバフをかけた!!`);
        }
    },
    // 敵全体の最大MPの平均数値を敵単体のHPの平均数値にするスペル
    buffEnemyHpByAvgAllEnemiesMaxMp: { name: '敵全員最大MP平均分敵HPバフ', cost: 0, type: 'buff', range: 'single', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 },
        effect: (target, source) => {
            const avgMaxMp = Math.floor(enemies.reduce((sum, e) => sum + e.maxMp, 0) / enemies.length);
            const enemyTarget = target[0];
            enemyTarget.hp = avgMaxMp;
            logWrite(`${source.name}は${enemyTarget.name}のHPを敵全員の最大MP平均(${avgMaxMp})にした!!`);
        }
    },
    // 敵全体の最大MPの平均数値を敵全体のHPの平均数値にするスペル
    buffEnemyHpByAvgAllEnemiesMaxMp2: { name: '敵全員最大MP平均分敵HPバフ(全員)', cost: 0, type: 'buff', range: 'all', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 },
        effect: (target, source) => {
            const avgMaxMp = Math.floor(enemies.reduce((sum, e) => sum + e.maxMp, 0) / enemies.length);
            for (let i = 0; i < target.length; i++) {
                target[i].hp = avgMaxMp;
            }
            logWrite(`${source.name}は${target.map(e => e.name).join(',')}のHPを敵全員の最大MP平均(${avgMaxMp})にした!!`);
        }
    },
    // 味方全体のMPの平均数値を自分のbuffs.strにするスペル
    buffStrByAvgAllMp: { name: '全員MP平均分Strバフ', cost: 0, type: 'buff', range: 'single', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 },
        effect: (target, source) => {
            const avgMp = Math.floor(heroes.reduce((sum, h) => sum + h.mp, 0) / heroes.length);
            source.buffs.str += avgMp;
            logWrite(`${source.name}は味方全員のMP平均(${avgMp})分のバフをかけた!!`);
        }
    },
    // 味方全体のMPの平均数値を味方全体のbuffs.strにするスペル
    buffStrByAvgAllMp2: { name: '全員MP平均分全員Strバフ', cost: 0, type: 'buff', range: 'all', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 },
        effect: (target, source) => {
            const avgMp = Math.floor(heroes.reduce((sum, h) => sum + h.mp, 0) / heroes.length);
            for (let i = 0; i < heroes.length; i++) {
                heroes[i].buffs.str += avgMp;
            }
            logWrite(`${source.name}は味方全員のMP平均(${avgMp})分のバフをかけた!!`);
        }
    },
    // 味方全体のMPの平均数値を敵単体のHPの平均数値にするスペル
    buffEnemyHpByAvgAllMp: { name: '全員MP平均分敵HPバフ', cost: 0, type: 'buff', range: 'single', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 },
        effect: (target, source) => {
            const avgMp = Math.floor(heroes.reduce((sum, h) => sum + h.mp, 0) / heroes.length);
            const enemyTarget = target[0];
            enemyTarget.hp = avgMp;
            logWrite(`${source.name}は${enemyTarget.name}のHPを味方全員のMP平均(${avgMp})にした!!`);
        }
    },
    // 味方全体のMPの平均数値を敵全体のHPの平均数値にするスペル
    buffEnemyHpByAvgAllMp2: { name: '全員MP平均分敵HPバフ(全員)', cost: 0, type: 'buff', range: 'all', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 },
        effect: (target, source) => {
            const avgMp = Math.floor(heroes.reduce((sum, h) => sum + h.mp, 0) / heroes.length);
            for (let i = 0; i < target.length; i++) {
                target[i].hp = avgMp;
            }
            logWrite(`${source.name}は${target.map(e => e.name).join(',')}のHPを味方全員のMP平均(${avgMp})にした!!`);
        }
    },
    // 敵全体のMPの平均数値を自分のbuffs.strにするスペル
    buffStrByAvgAllEnemiesMp: { name: '敵全員MP平均分Strバフ', cost: 0, type: 'buff', range: 'single', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 },
        effect: (target, source) => {
            const avgMp = Math.floor(enemies.reduce((sum, e) => sum + e.mp, 0) / enemies.length);
            source.buffs.str += avgMp;
            logWrite(`${source.name}は敵全員のMP平均(${avgMp})分のバフをかけた!!`);
        }
    },
    // 敵全体のMPの平均数値を味方全体のbuffs.strにするスペル
    buffStrByAvgAllEnemiesMp2: { name: '敵全員MP平均分全員Strバフ', cost: 0, type: 'buff', range: 'all', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 },
        effect: (target, source) => {
            const avgMp = Math.floor(enemies.reduce((sum, e) => sum + e.mp, 0) / enemies.length);
            for (let i = 0; i < heroes.length; i++) {
                heroes[i].buffs.str += avgMp;
            }
            logWrite(`${source.name}は敵全員のMP平均(${avgMp})分のバフをかけた!!`);
        }
    },
    // 敵全体のMPの平均数値を敵単体のHPの平均数値にするスペル
    buffEnemyHpByAvgAllEnemiesMp: { name: '敵全員MP平均分敵HPバフ', cost: 0, type: 'buff', range: 'single', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 },
        effect: (target, source) => {
            const avgMp = Math.floor(enemies.reduce((sum, e) => sum + e.mp, 0) / enemies.length);
            const enemyTarget = target[0];
            enemyTarget.hp = avgMp;
            logWrite(`${source.name}は${enemyTarget.name}のHPを敵全員のMP平均(${avgMp})にした!!`);
        }
    },
    // 敵全体のMPの平均数値を敵全体のHPの平均数値にするスペル
    buffEnemyHpByAvgAllEnemiesMp2: { name: '敵全員MP平均分敵HPバフ(全員)', cost: 0, type: 'buff', range: 'all', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 },
        effect: (target, source) => {
            const avgMp = Math.floor(enemies.reduce((sum, e) => sum + e.mp, 0) / enemies.length);
            for (let i = 0; i < target.length; i++) {
                target[i].hp = avgMp;
            }
            logWrite(`${source.name}は${target.map(e => e.name).join(',')}のHPを敵全員のMP平均(${avgMp})にした!!`);
        }
    },
    // 単体の敵と自らを入れ替えるスペル(未テスト 他のコードも変更する必要あり)
    tradeEnemy: { name: '敵と入れ替え', cost: 0, type: 'other', range: 'single', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, effect: (target, source) => {
        const temp = target[0];target[0] = source;source = temp;logWrite(`${source.name}は${target[0].name}と入れ替えた!!`) } },
    // 単体の敵のスペルを自らにコピーするスペル(未テスト 他のコードも変更する必要あり)
    copyEnemySpell: { name: '敵のスペルをコピー', cost: 0, type: 'other', range: 'single', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, effect: (target, source) => {
        const temp = target[0];target[0] = source;source = temp;logWrite(`${source.name}は${target[0].name}のスペルをコピーした!!`) } },
    // 単体の味方にLvの数だけbuffs.strに上昇するスペル
    buffStrByLevel: { name: 'レベル分Strバフ', cost: 0, type: 'buff', range: 'single', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, effect: (target, source) => {
        const buff_target = target[0];
        const buffAmount = source.level;buff_target.buffs.str += buffAmount;logWrite(`${source.name}は${buff_target.name}にレベル(${buffAmount})分のバフをかけた!!`) } },
    // 単体の味方に最大HPの数だけbuffs.strに上昇するスペル
    buffStrByMaxHp: { name: '最大HP分Strバフ', cost: 0, type: 'buff', range: 'single', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, effect: (target, source) => {
        const buff_target = target[0];
        const buffAmount = buff_target.maxHp;buff_target.buffs.str += buffAmount;logWrite(`${source.name}は${buff_target.name}に最大HP(${buffAmount})分のバフをかけた!!`) } },
    // 単体の味方に最大MPの数だけbuffs.strに上昇するスペル
    buffStrByMaxMp: { name: '最大MP分Strバフ', cost: 0, type: 'buff', range: 'single', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, effect: (target, source) => {
        const buff_target = target[0];
        const buffAmount = buff_target.maxMp;buff_target.buffs.str += buffAmount;logWrite(`${source.name}は${buff_target.name}に最大MP(${buffAmount})分のバフをかけた!!`) } },
    // 単体の味方にHPの数だけbuffs.strに上昇するスペル
    buffStrByHp: { name: 'HP分Strバフ', cost: 0, type: 'buff', range: 'single', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, effect: (target, source) => {
        const buff_target = target[0];
        const buffAmount = buff_target.hp;buff_target.buffs.str += buffAmount;logWrite(`${source.name}は${buff_target.name}にHP(${buffAmount})分のバフをかけた!!`) } },
    // 単体の味方にMPの数だけbuffs.strに上昇するスペル
    buffStrByMp: { name: 'MP分Strバフ', cost: 0, type: 'buff', range: 'single', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, effect: (target, source) => {
        const buff_target = target[0];
        const buffAmount = buff_target.mp;buff_target.buffs.str += buffAmount;logWrite(`${source.name}は${buff_target.name}にMP(${buffAmount})分のバフをかけた!!`) } },
    // 味方全体に最大HPの数だけbuffs.strに上昇するスペル
    buffStrByAllMaxHp: { name: '全員最大HP分Strバフ', cost: 0, type: 'buff', range: 'all', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, effect: (target, source) => {
        for (let i = 0; i < target.length; i++) {const buff_target = target[i];const buffAmount = buff_target.maxHp;buff_target.buffs.str += buffAmount;logWrite(`${source.name}は${buff_target.name}に最大HP(${buffAmount})分のバフをかけた!!`) } } },
    // 味方全体に最大MPの数だけbuffs.strに上昇するスペル
    buffStrByAllMaxMp: { name: '全員最大MP分Strバフ', cost: 0, type: 'buff', range: 'all', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, effect: (target, source) => {
        for (let i = 0; i < target.length; i++) {const buff_target = target[i];const buffAmount = buff_target.maxMp;buff_target.buffs.str += buffAmount;logWrite(`${source.name}は${buff_target.name}に最大MP(${buffAmount})分のバフをかけた!!`) } } },
    // 単体の味方のbuffs.strを2倍にするスペル(現在の数値が0の場合は2倍にならない)
    buffStrDouble: { name: 'Strバフ2倍', cost: 0, type: 'buff', range: 'single', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, effect: (target, source) => {
        const buff_target = target[0];
        if (buff_target.buffs.str > 0) {buff_target.buffs.str *= 2;logWrite(`${source.name}は${buff_target.name}のStrバフを2倍にした!!`) } } },
    // 味方全体のbuffs.strを2倍にするスペル(現在の数値が0の場合は2倍にならない)
    buffStrDoubleAll: { name: '全員Strバフ2倍', cost: 0, type: 'buff', range: 'all', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, effect: (target, source) => {
        for (let i = 0; i < target.length; i++) {const buff_target = target[i];if (buff_target.buffs.str > 0) {buff_target.buffs.str *= 2;logWrite(`${source.name}は${buff_target.name}のStrバフを2倍にした!!`) } } } },
    // 単体の味方のbuffs.strを10倍にするスペル(現在の数値が0の場合は10倍にならない)
    buffStrTenTimes: { name: 'Strバフ10倍', cost: 0, type: 'buff', range: 'single', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, effect: (target, source) => {
        const buff_target = target[0];
        if (buff_target.buffs.str > 0) {buff_target.buffs.str *= 10;logWrite(`${source.name}は${buff_target.name}のStrバフを10倍にした!!`) } } },
    // 味方全体のbuffs.strを10倍にするスペル(現在の数値が0の場合は10倍にならない)
    buffStrTenTimesAll: { name: '全員Strバフ10倍', cost: 0, type: 'buff', range: 'all', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, effect: (target, source) => {
        for (let i = 0; i < target.length; i++) {const buff_target = target[i];if (buff_target.buffs.str > 0) {buff_target.buffs.str *= 10;logWrite(`${source.name}は${buff_target.name}のStrバフを10倍にした!!`) } } } },
    // 所持するexpの数だけbuffs.strに上昇するスペル
    buffStrByExp: { name: '所持exp分Strバフ', cost: 0, type: 'buff', range: 'single', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, effect: (target, source) => {
        const buff_target = target[0];
        const buffAmount = source.exp;buff_target.buffs.str += buffAmount;logWrite(`${source.name}は${buff_target.name}に所持exp(${buffAmount})分のバフをかけた!!`) } },
    // 所持するexpの数だけ単体の敵にダメージを与えるスペル
    dmgByExp: { name: '所持exp分ダメージ', cost: 0, type: 'dmg', range: 'single', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, effect: (target, source) => {
        const dmgAmount = source.exp;target.hp -= dmgAmount;logWrite(`${source.name}は${target.name}に所持exp(${dmgAmount})分のダメージを与えた!!`) } },
    // caster単体の所持するexpの数だけ敵全体にダメージを与えるスペル
    dmgByAllExp: { name: '所持exp分全体ダメージ', cost: 0, type: 'dmg', range: 'all', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, effect: (target, source) => {
        const dmgAmount = source.exp;for (let i = 0; i < target.length; i++) {const enemy = target[i];enemy.hp -= dmgAmount;logWrite(`${source.name}は${enemy.name}に所持exp(${dmgAmount})分のダメージを与えた!!`) } } },
    // 味方全体の所持するexpの合計数だけ敵単体にダメージを与えるスペル
    dmgByAllExpSingle: { name: '所持exp分全体ダメージ(単体)', cost: 0, type: 'dmg', range: 'single', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, effect: (target, source) => {
        const dmgAmount = heroes.reduce((sum, hero) => sum + hero.exp, 0);target.hp -= dmgAmount;logWrite(`${source.name}は${target.name}に所持exp(${dmgAmount})分のダメージを与えた!!`) } },
    // 味方全体の所持するexpの合計数だけ敵全体にダメージを与えるスペル
    dmgByAllExpAll: { name: '所持exp分全体ダメージ(全体)', cost: 0, type: 'dmg', range: 'all', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, effect: (target, source) => {
        const dmgAmount = heroes.reduce((sum, hero) => sum + hero.exp, 0);for (let i = 0; i < target.length; i++) {const enemy = target[i];enemy.hp -= dmgAmount;logWrite(`${source.name}は${enemy.name}に所持exp(${dmgAmount})分のダメージを与えた!!`) } } },
    // buffs.str*最大MPの数を敵単体にダメージを与えるスペル
    dmgByBuffStrMaxMp: { name: 'バフStr*最大MP分ダメージ', cost: 0, type: 'dmg', range: 'single', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, effect: (target, source) => {
        const dmgAmount = source.buffs.str * source.maxMp;target.hp -= dmgAmount;logWrite(`${source.name}は${target.name}にバフStr(${source.buffs.str})*最大MP(${source.maxMp})分のダメージを与えた!!`) } },
    // buffs.str*最大MPの数を敵全体にダメージを与えるスペル
    dmgByBuffStrMaxMpAll: { name: 'バフStr*最大MP分全体ダメージ', cost: 0, type: 'dmg', range: 'all', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, effect: (target, source) => {
        const dmgAmount = source.buffs.str * source.maxMp;for (let i = 0; i < target.length; i++) {const enemy = target[i];enemy.hp -= dmgAmount;logWrite(`${source.name}は${enemy.name}にバフStr(${source.buffs.str})*最大MP(${source.maxMp})分のダメージを与えた!!`) } } },
    // buffs.str*最大HPの数を敵単体にダメージを与えるスペル
    dmgByBuffStrMaxHp: { name: 'バフStr*最大HP分ダメージ', cost: 0, type: 'dmg', range: 'single', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, effect: (target, source) => {
        const dmgAmount = source.buffs.str * source.maxHp;target.hp -= dmgAmount;logWrite(`${source.name}は${target.name}にバフStr(${source.buffs.str})*最大HP(${source.maxHp})分のダメージを与えた!!`) } },
    // buffs.str*最大HPの数を敵全体にダメージを与えるスペル
    dmgByBuffStrMaxHpAll: { name: 'バフStr*最大HP分全体ダメージ', cost: 0, type: 'dmg', range: 'all', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, effect: (target, source) => {
        const dmgAmount = source.buffs.str * source.maxHp;for (let i = 0; i < target.length; i++) {const enemy = target[i];enemy.hp -= dmgAmount;logWrite(`${source.name}は${enemy.name}にバフStr(${source.buffs.str})*最大HP(${source.maxHp})分のダメージを与えた!!`) } } },
    // 単体の敵の最大HPの量だけMPを回復する(最大MPまで充填できる)スペル
    recoverMpByEnemyMaxHp: {name: '敵最大HP分MP回復',cost: 0,type: 'other',range: 'single',val: [0, 0],requiredJobs: { 戦士: 2, 僧侶: 2 },effect: (target, source) => {console.log("xxxXXX");const recoverAmount = target.maxHp;source.mp = recoverAmount > source.maxMp ? source.maxMp : recoverAmount;logWrite(`${source.name}は${target.name}の最大HP(${recoverAmount})分MPを回復した!!`)}},
    // 単体の敵の最大HPの量だけMPを回復する(最大MPを超えて充填できる)スペル
    recoverMpByEnemyMaxHpOver: {name: '敵最大HP分MP回復(リミットブレイク)',cost: 0,type: 'other',range: 'single',val: [0, 0],requiredJobs: { 戦士: 2, 僧侶: 2 },effect: (target, source) => {const recoverAmount = target.maxHp;source.mp += recoverAmount;logWrite(`${source.name}は${target.name}の最大HP(${recoverAmount})分MPを回復した!!`)}},
    // 敵全員の最大HPの合計だけMPを回復する(最大MPまで充填できる)スペル
    recoverMpByAllEnemiesMaxHp: {name: '敵全員最大HP分MP回復',cost: 0,type: 'other',range: 'single',val: [0, 0],requiredJobs: { 戦士: 2, 僧侶: 2 },effect: (target, source) => {const recoverAmount = enemies.reduce((sum, enemy) => sum + enemy.maxHp, 0);source.mp = recoverAmount > source.maxMp ? source.maxMp : recoverAmount;logWrite(`${source.name}は敵全員の最大HP(${recoverAmount})分MPを回復した!!`)}},
    // 敵全員の最大HPの合計だけMPを回復する(最大MPを超えて充填できる)スペル
    recoverMpByAllEnemiesMaxHpOver: {name: '敵全員最大HP分MP回復(リミットブレイク)',cost: 0,type: 'other',range: 'single',val: [0, 0],requiredJobs: { 戦士: 2, 僧侶: 2 },effect: (target, source) => {const recoverAmount = enemies.reduce((sum, enemy) => sum + enemy.maxHp, 0);source.mp += recoverAmount;logWrite(`${source.name}は敵全員の最大HP(${recoverAmount})分MPを回復した!!`)}},
    // 単体の敵の最大MPの量だけMPを回復する(最大MPまで充填できる)スペル
    recoverMpByEnemyMaxMp: {name: '敵最大MP分MP回復',cost: 0,type: 'other',range: 'single',val: [0, 0],requiredJobs: { 戦士: 2, 僧侶: 2 },effect: (target, source) => {const recoverAmount = target.maxMp;source.mp = recoverAmount > source.maxMp ? source.maxMp : recoverAmount;logWrite(`${source.name}は${target.name}の最大MP(${recoverAmount})分MPを回復した!!`)}},
    // 単体の敵の最大MPの量だけMPを回復する(最大MPを超えて充填できる)スペル
    recoverMpByEnemyMaxMpOver: {name: '敵最大MP分MP回復(リミットブレイク)',cost: 0,type: 'other',range: 'single',val: [0, 0],requiredJobs: { 戦士: 2, 僧侶: 2 },effect: (target, source) => {const recoverAmount = target.maxMp;source.mp += recoverAmount;logWrite(`${source.name}は${target.name}の最大MP(${recoverAmount})分MPを回復した!!`)}},
    // 敵全員の最大MPの合計だけMPを回復する(最大MPまで充填できる)スペル
    recoverMpByAllEnemiesMaxMp: {name: '敵全員最大MP分MP回復',cost: 0,type: 'other',range: 'single',val: [0, 0],requiredJobs: { 戦士: 2, 僧侶: 2 },effect: (target, source) => {const recoverAmount = enemies.reduce((sum, enemy) => sum + enemy.maxMp, 0);source.mp = recoverAmount > source.maxMp ? source.maxMp : recoverAmount;logWrite(`${source.name}は敵全員の最大MP(${recoverAmount})分MPを回復した!!`)}},
    // 敵全員の最大MPの合計だけMPを回復する(最大MPを超えて充填できる)スペル
    recoverMpByAllEnemiesMaxMpOver: {name: '敵全員最大MP分MP回復(リミットブレイク)',cost: 0,type: 'other',range: 'single',val: [0, 0],requiredJobs: { 戦士: 2, 僧侶: 2 },effect: (target, source) => {const recoverAmount = enemies.reduce((sum, enemy) => sum + enemy.maxMp, 0);source.mp += recoverAmount;logWrite(`${source.name}は敵全員の最大MP(${recoverAmount})分MPを回復した!!`)}},
    // 敵の最大MPと同じ量のダメージのスペル
    dealMaxMpDmg: { name: '最大MPダメージ', cost: 0, type: 'other', range: 'single', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, effect: (target, source) => {const dealAmount = target.maxMp;target.hp -= dealAmount;logWrite(`${source.name}が${target.name}の最大MPをダメージとして食らわせた!!`) } },
    // 敵の最大MPの倍の量のダメージのスペル
    dealMaxDoubleMpDmg: { name: '最大MP2倍ダメージ', cost: 0, type: 'other', range: 'single', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, effect: (target, source) => {const dealAmount = target.maxMp*2;target.hp -= dealAmount;logWrite(`${source.name}が${target.name}の最大MPをダメージとして食らわせた!!`) } },
    // 敵のMPの量のダメージのスペル
    dealMpDmg: { name: 'MPダメージ', cost: 0, type: 'other', range: 'single', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, effect: (target, source) => {const dealAmount = target.mp;target.hp -= dealAmount;logWrite(`${source.name}が${target.name}のMPをダメージとして食らわせた!!`) } },
    // 敵のMPの倍の量のダメージのスペル
    dealDoubleMpDmg: { name: 'MP2倍ダメージ', cost: 0, type: 'other', range: 'single', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, effect: (target, source) => {const dealAmount = target.mp*2;target.hp -= dealAmount;logWrite(`${source.name}が${target.name}のMPをダメージとして食らわせた!!`) } },
    // 敵の最大MPと同じ量のダメージを敵全員に与えるスペル
    dealMaxMpDmgAll: { name: '最大MPダメージ全員', cost: 0, type: 'other', range: 'single', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 },
        effect: (target, source) => {const dealAmount = target.maxMp;
        for (let i = 0; i < enemies.length; i++) {const enemy = enemies[i];enemy.hp -= dealAmount;logWrite(`${source.name}が${enemy.name}の最大MPをダメージとして食らわせた!!`);}
    } },
    // 敵の最大HPと1/4の量のダメージのスペル
    dealQuarterMaxHpDmg: { name: '最大HP1/4ダメージ', cost: 0, type: 'other', range: 'single', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, effect: (target, source) => {const dealAmount = Math.floor(target.maxHp * 0.25);target.hp -= dealAmount;logWrite(`${source.name}が${target.name}の最大HPをダメージとして食らわせた!!`) } },
    // 敵の最大HPの半分の量のダメージのスペル
    dealHalfMaxHpDmg: { name: '最大HP1/2ダメージ', cost: 0, type: 'other', range: 'single', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, effect: (target, source) => {const dealAmount = Math.floor(target.maxHp * 0.5);target.hp -= dealAmount;logWrite(`${source.name}が${target.name}の最大HPをダメージとして食らわせた!!`) } },
    // 敵の最大HPの量のダメージのスペル
    dealMaxHpDmg: { name: '最大HPダメージ', cost: 0, type: 'other', range: 'single', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 }, effect: (target, source) => {const dealAmount = target.maxHp;target.hp -= dealAmount;logWrite(`${source.name}が${target.name}の最大HPをダメージとして食らわせた!!`) } },
    // 敵の最大HPと1/4の量のダメージを敵全員に与えるスペル
    dealQuarterMaxHpDmgAll: { name: '最大HP1/4ダメージ全員', cost: 0, type: 'other', range: 'single', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 },
        effect: (target, source) => {const dealAmount = Math.floor(target.maxHp * 0.25);
        for (let i = 0; i < enemies.length; i++) {const enemy = enemies[i];enemy.hp -= dealAmount;logWrite(`${source.name}が${enemy.name}の最大HPをダメージとして食らわせた!!`);}
    } },
    // 敵の最大HPと半分の量のダメージを敵全員に与えるスペル
    dealHalfMaxHpDmgAll: { name: '最大HP1/2ダメージ全員', cost: 0, type: 'other', range: 'single', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 },
        effect: (target, source) => {const dealAmount = Math.floor(target.maxHp * 0.5);
        for (let i = 0; i < enemies.length; i++) {const enemy = enemies[i];enemy.hp -= dealAmount;logWrite(`${source.name}が${enemy.name}の最大HPをダメージとして食らわせた!!`);}
    } },
    // enemiesの数だけ単体の敵にダメージを与えるスペル
    dealSingleDmgAll: { name: '敵数ダメージ単体', cost: 0, type: 'other', range: 'single', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 },
        effect: (target, source) => {const dealAmount = enemies.length;
        target.hp -= dealAmount;logWrite(`${source.name}が${target.name}にダメージを与えた!!`);}
    },
    // enemiesの数だけ全体の敵にダメージを与えるスペル
    dealAllDmgAll: { name: '敵数ダメージ全体', cost: 0, type: 'other', range: 'single', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 },
        effect: (target, source) => {const dealAmount = enemies.length;
        for (let i = 0; i < enemies.length; i++) {const enemy = enemies[i];enemy.hp -= dealAmount;logWrite(`${source.name}が${enemy.name}にダメージを与えた!!`);}
    } },
    // heroesの数だけ単体の敵にダメージを与えるスペル
    dealSingleDmgHeroes: { name: '味方数ダメージ単体', cost: 0, type: 'other', range: 'single', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 },
        effect: (target, source) => {const dealAmount = heroes.length;
        target.hp -= dealAmount;logWrite(`${source.name}が${target.name}にダメージを与えた!!`);}
    },
    // heroesの数だけ全体の敵にダメージを与えるスペル
    dealAllDmgHeroes: { name: '味方数ダメージ全体', cost: 0, type: 'other', range: 'single', val: [0, 0], requiredJobs: { 戦士: 2, 僧侶: 2 },
        effect: (target, source) => {const dealAmount = heroes.length;
        for (let i = 0; i < enemies.length; i++) {const enemy = enemies[i];enemy.hp -= dealAmount;logWrite(`${source.name}が${enemy.name}にダメージを与えた!!`);}
    } },
};


