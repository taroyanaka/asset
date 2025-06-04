// SPELLS_TESTに格納してまとめて増えたら一気に実行する
let SPELLS_TEST = {};

// SPELLS_TEST それぞれのSPELLのテストをするためのステータスと操作の実行をまとめたコード
const tradeHpMp_TEST_prepara_and_exe = () => {
    const tradeHpMp_TEST_prepara = () => {INITIAL_HEROES_VOLUME = 2;startBattle()};
    function tradeHpMp_TEST(test_fn, target, source) {
        const target_mp = JSON.parse(JSON.stringify(target.mp));
        const target_hp = JSON.parse(JSON.stringify(target.hp));
        test_fn.effect(target, source);
        const target_hp_after = target.hp;
        const target_mp_after = target.mp;
        if (target_hp_after === target_mp && target_mp_after === target_hp) {
            console.log(`テスト成功: ${target.name}のHP(${target_hp})とMP(${target_mp})が入れ替わった!!`);
        } else {
            console.log(`テスト失敗: ${target.name}のHP(${target_hp_after})とMP(${target_mp_after})が入れ替わらなかった!!`);
        }
    };
    tradeHpMp_TEST_prepara();
    tradeHpMp_TEST((SPELLS.tradeHpMp||ITEM_LIST.tradeHpMp||INVENTORY.tradeHpMp), heroes[1], heroes[1]);
    updateStats();
}
const tradeHpMpAll_TEST_prepara_and_exe = () => {
    const tradeHpMpAll_TEST_prepara = () => {INITIAL_HEROES_VOLUME = 2;startBattle()};
    function tradeHpMpAll_TEST(test_fn) {
        // heroes[0]のHPとMPを保存
        const target_mp_before = JSON.parse(JSON.stringify(heroes[0].mp));
        const target_hp_before = JSON.parse(JSON.stringify(heroes[0].hp));
        const target_mp2_before = JSON.parse(JSON.stringify(heroes[1].mp));
        const target_hp2_before = JSON.parse(JSON.stringify(heroes[1].hp));
        test_fn.effect(heroes[0], heroes[1]);
        const target_hp_after = heroes[0].hp;
        const target_mp_after = heroes[0].mp;
        const target_hp2_after = heroes[1].hp;
        const target_mp2_after = heroes[1].mp;
        if (target_hp_after === target_mp_before && target_mp_after === target_hp_before &&
            target_hp2_after === target_mp2_before && target_mp2_after === target_hp2_before) {
            console.log(`テスト成功: ${heroes[0].name}のHP(${target_hp_before})とMP(${target_mp_before})が入れ替わり、${heroes[1].name}のHP(${target_hp2_before})とMP(${target_mp2_before})が入れ替わった!!`);
        } else {
            console.log(`テスト失敗: ${heroes[0].name}のHP(${target_hp_after})とMP(${target_mp_after})が入れ替わらなかった!!`);
            console.log(`テスト失敗: ${heroes[1].name}のHP(${target_hp2_after})とMP(${target_mp2_after})が入れ替わらなかった!!`);
        }
    }
    tradeHpMpAll_TEST_prepara();
    tradeHpMpAll_TEST((SPELLS.tradeHpMpAll||ITEM_LIST.tradeHpMpAll||INVENTORY.tradeHpMpAll));
    updateStats();
};
const tradeMp_TEST_prepara_and_exe = () => {
    const tradeMp_TEST_prepara = () => {INITIAL_HEROES_VOLUME = 2;
        startBattle()};
    function tradeMp_TEST(test_fn, target, source) {
        const target_mp = JSON.parse(JSON.stringify(target.mp));
        const source_mp = JSON.parse(JSON.stringify(source.mp));

        test_fn.effect(target, source);
        const target_mp_after = target.mp;
        const source_mp_after = source.mp;
        if ( target_mp_after === source_mp && source_mp_after === target_mp) {
            console.log(`テスト成功: ${target.name}のMP(${target_mp})と${source.name}のMP(${source_mp})が入れ替わった!!`);
        } else {
            console.log(`テスト失敗: ${target.name}のMP(${target_mp_after})が0にならなかった!!`);
        }
    };
    tradeMp_TEST_prepara();
    tradeMp_TEST((SPELLS.tradeMp||ITEM_LIST.tradeMp||INVENTORY.tradeMp), enemies[0], heroes[0]);
    updateStats();updateEnemies();
};
const tradeMaxMp_TEST_prepara_and_exe = () => {
    const tradeMaxMp_TEST_prepara = () => {
        INITIAL_HEROES_VOLUME = 3;
        startBattle()}
    function tradeMaxMp_TEST(test_fn, target, source) {
        const target_max_mp = JSON.parse(JSON.stringify(target.maxMp));
        const source_mp = JSON.parse(JSON.stringify(source.mp));
        test_fn.effect(target, source);
        const target_max_mp_after = target.maxMp;
        const source_mp_after = source.mp;
        if (target_max_mp_after === source_mp && source_mp_after === target_max_mp) {
            console.log(`テスト成功: ${target.name}の最大MP(${target_max_mp})と${source.name}のMP(${source_mp})が入れ替わった!!`);
        } else {
            console.log(`テスト失敗: ${target.name}の最大MP(${target_max_mp_after})が0にならなかった!!`);
        }

    };
    tradeMaxMp_TEST_prepara();
    tradeMaxMp_TEST((SPELLS.tradeMaxMp||ITEM_LIST.tradeMaxMp||INVENTORY.tradeMaxMp), enemies[0], heroes[0]);
    updateStats();updateEnemies();
};
const tradeMpAll_TEST_prepara_and_exe = () => {
    function tradeMpAll_TEST(test_fn, target, source) {
        const totalMp = enemies.reduce((sum, enemy) => sum + enemy.mp, 0);
        test_fn.effect(enemies, source);
        const source_mp_after = source.mp;
        if (source_mp_after === totalMp) {
            console.log(`テスト成功: ${source.name}のMPが敵全体のMP(${totalMp})に変換された!!`);
        } else {
            console.log(`テスト失敗: ${source.name}のMP(${source_mp_after})が敵全体のMP(${totalMp})に変換されなかった!!`);
        }
    };
    tradeMpAll_TEST_prepara();
    tradeMpAll_TEST((SPELLS.tradeMpAll||ITEM_LIST.tradeMpAll||INVENTORY.tradeMpAll), enemies, heroes[0]);
    updateStats();updateEnemies();
};
const tradeMaxMpAll_TEST_prepara_and_exe = () => {
    const tradeMaxMpAll_TEST_prepara = () => {
        INITIAL_HEROES_VOLUME = 3;
        startBattle();
    };
    function tradeMaxMpAll_TEST(test_fn, target, source) {
        const totalMaxMp = enemies.reduce((sum, enemy) => sum + enemy.maxMp, 0);
        test_fn.effect(enemies, source);
        const source_mp_after = source.mp;
        if (source_mp_after === totalMaxMp) {
            console.log(`テスト成功: ${source.name}のMPが敵全体の最大MP(${totalMaxMp})に変換された!!`);
        } else {
            console.log(`テスト失敗: ${source.name}のMP(${source_mp_after})が敵全体の最大MP(${totalMaxMp})に変換されなかった!!`);
        }
    };
    tradeMaxMpAll_TEST_prepara();
    tradeMaxMpAll_TEST((SPELLS.tradeMaxMpAll||ITEM_LIST.tradeMaxMpAll||INVENTORY.tradeMaxMpAll), enemies, heroes[0]);
    updateStats();updateEnemies();

};
const strBuff_TEST_prepara_and_exe = () => {
    const strBuff_TEST_prepara = () => {INITIAL_HEROES_VOLUME = 2;startBattle()};
    function no_buff_dmg(test_fn, target, source) {
        const baseDmg = test_fn.val[0];
        const dmg = baseDmg + source.buffs.str;
        target.hp -= dmg;
        return dmg;
    };
    function buff_dmg(test_fn, target, source) {
        const baseDmg = test_fn.val[0];
        const buffedDmg = baseDmg + source.buffs.str;
        target.hp -= buffedDmg;
        return buffedDmg;
    };
    function strBuff_TEST(test_fn, target, source) {
        const no_buff_dmg_value = no_buff_dmg(test_fn, target, source);
        console.log(`バフ前のダメージ: ${no_buff_dmg_value}`);
        source.buffs.str += 10;
        const buffedDmg = buff_dmg(test_fn, target, source);
        console.log(`バフ後のダメージ: ${buffedDmg}`);
        if (buffedDmg > no_buff_dmg_value) {
            console.log(`テスト成功: ${source.name}のバフSTR(${source.buffs.str})によりダメージが増加した!!`);
        } else {
            console.log(`テスト失敗: ${source.name}のバフSTR(${source.buffs.str})がダメージに影響しなかった!!`);
        }
    };
    strBuff_TEST_prepara();
    strBuff_TEST((SPELLS.itami||ITEM_LIST.itami||INVENTORY.itami), enemies[0], heroes[0]);
    updateStats();updateEnemies();
};
const tradeMpByStr_TEST_prepara_and_exe = () => {
    const tradeMpByStr_TEST_prepara = () => {INITIAL_HEROES_VOLUME = 2;startBattle()};
    function tradeMpByStr_TEST(test_fn, target, source) {
        const target_mp = JSON.parse(JSON.stringify(target.mp));
        const source_str = JSON.parse(JSON.stringify(source.buffs.str));
        test_fn.effect(target, source);
        const target_mp_after = target.mp;
        const source_str_after = source.buffs.str;
        if (target_mp_after === source_str && source_str_after === target_mp) {
            console.log(`テスト成功: ${target.name}のMP(${target_mp})と${source.name}のバフSTR(${source_str})が入れ替わった!!`);
        } else {
            console.log(`テスト失敗: ${target.name}のMP(${target_mp_after})と${source.name}のバフSTR(${source_str_after})が入れ替わらなかった!!`);
        }
    };
    tradeMpByStr_TEST_prepara();
    tradeMpByStr_TEST((SPELLS.tradeMpByStr||ITEM_LIST.tradeMpByStr||INVENTORY.tradeMpByStr), enemies[0], heroes[0]);
    updateStats();updateEnemies();

};
const tradeMaxMpByStr_TEST_prepara_and_exe = () => {
    const tradeMaxMpByStr_TEST_prepara = () => {INITIAL_HEROES_VOLUME = 2;startBattle()};
    function tradeMaxMpByStr_TEST(test_fn, target, source) {
        const target_max_mp = JSON.parse(JSON.stringify(target.maxMp));
        const source_str = JSON.parse(JSON.stringify(source.buffs.str));
        test_fn.effect(target, source);
        const target_max_mp_after = target.maxMp;
        const source_str_after = source.buffs.str;
        if (target_max_mp_after === source_str && source_str_after === target_max_mp) {
            console.log(`テスト成功: ${target.name}の最大MP(${target_max_mp})と${source.name}のバフSTR(${source_str})が入れ替わった!!`);
        } else {
            console.log(`テスト失敗: ${target.name}の最大MP(${target_max_mp_after})と${source.name}のバフSTR(${source_str_after})が入れ替わらなかった!!`);
        }
    };
    tradeMaxMpByStr_TEST_prepara();
    tradeMaxMpByStr_TEST((SPELLS.tradeMaxMpByStr||ITEM_LIST.tradeMaxMpByStr||INVENTORY.tradeMaxMpByStr), enemies[0], heroes[0]);
    updateStats();updateEnemies();

};
const tradeMpAllByStr_TEST_prepara_and_exe = () => {
    const tradeMpAllByStr_TEST_prepara = () => {INITIAL_HEROES_VOLUME = 2;startBattle()};
    function tradeMpAllByStr_TEST(test_fn, target, source) {
        const totalMp = target.reduce((sum, enemy) => sum + enemy.mp, 0);
        test_fn.effect(target, source);
        const source_str_after = source.buffs.str;
        if (source_str_after === totalMp) {
            console.log(`テスト成功: ${source.name}のバフSTRが敵全体のMP合計(${totalMp})になった!!`);
        } else {
            console.log(`テスト失敗: ${source.name}のバフSTR(${source_str_after})が敵全体のMP合計(${totalMp})になった!!`);
        }
    };
    tradeMpAllByStr_TEST_prepara();
    tradeMpAllByStr_TEST((SPELLS.tradeMpAllByStr||ITEM_LIST.tradeMpAllByStr||INVENTORY.tradeMpAllByStr), enemies, heroes[0]);
    updateStats();updateEnemies();
};

