;ティラノスクリプトサンプルゲーム

*start

[cm  ]
[clearfix]
[start_keyconfig]


[bg storage="room.jpg" time="100"]

;メニューボタンの表示
@showmenubutton

;メッセージウィンドウの設定
[position layer="message0" left=160 top=500 width=1000 height=200 page=fore visible=true]

;文字が表示される領域を調整
[position layer=message0 page=fore margint="45" marginl="50" marginr="70" marginb="60"]


;メッセージウィンドウの表示
@layopt layer=message0 visible=true

;キャラクターの名前が表示される文字領域
[ptext name="chara_name_area" layer="message0" color="white" size=28 bold=true x=180 y=510]

;上記で定義した領域がキャラクターの名前表示であることを宣言（これがないと#の部分でエラーになります）
[chara_config ptext="chara_name_area"]

;このゲームで登場するキャラクターを宣言
;akane
[chara_new  name="akane" storage="chara/akane/normal.png" jname="あかね"  ]
;キャラクターの表情登録
[chara_face name="akane" face="angry" storage="chara/akane/angry.png"]
[chara_face name="akane" face="doki" storage="chara/akane/doki.png"]
[chara_face name="akane" face="happy" storage="chara/akane/happy.png"]
[chara_face name="akane" face="sad" storage="chara/akane/sad.png"]


;yamato
[chara_new  name="yamato"  storage="chara/yamato/normal.png" jname="やまと" ]

[glink_config auto_place="true" show_time="300"]
[position left="160" top="500" width="1000" height="200" visible="true"]
[position margint="45" marginl="50" marginr="70" marginb="60"]


*1
旅立ちの日、君は村の長老に呼ばれた。[p]
[glink text="北の森を抜ける" target="*2"]
[glink text="東の山道へ向かう" target="*3"]
[glink text="西の街へ情報収集に行く" target="*4"]
[s]
*2
[bg  time="3000"  method="crossfade" storage="rouka.jpg"  ]
森の中で獣に襲われている旅人を見つけた。[p]
[glink text="助ける" target="*5"]
[glink text="無視して進む" target="*6"]
[glink text="隠れて様子を見る" target="*7"]
[s]
*3
山道は崩れていた。洞窟を見つけた。[p]
[glink text="洞窟に入る" target="*8"]
[glink text="引き返す" target="*1"]
[glink text="崖をよじ登る" target="*9"]
[s]
*4
街は祭りの最中だった。占い師に出会う。[p]
[glink text="占いを聞く" target="*10"]
[glink text="情報屋を探す" target="*11"]
[glink text="祭りに紛れて盗賊を探す" target="*12"]
[s]
*5
君は旅人を助けた。彼は仲間になった！[p]
[glink text="一緒に遺跡を目指す" target="*13"]
[glink text="一度村に戻る" target="*14"]
[glink text="森を抜けて南へ" target="*15"]
[s]
*6
君は先を急いだが、何かが君を見ていた。[p]
[glink text="気にせず進む" target="*15"]
[glink text="背後を振り返る" target="*16"]
[glink text="急いで森を抜ける" target="*13"]
[s]
*7
獣が君に気づいた！襲いかかってくる！[p]
[glink text="戦う" target="*17"]
[glink text="逃げる" target="*18"]
[glink text="魔法で眠らせる" target="*19"]
[s]
*8
洞窟の奥に古代の紋章があった。[p]
[glink text="調べる" target="*20"]
[glink text="無視して進む" target="*21"]
[glink text="危険なので戻る" target="*3"]
[s]
*9
崖を登る途中で足を滑らせた！[p]
[glink text="岩にしがみつく" target="*22"]
[glink text="仲間を呼ぶ" target="*5"]
[glink text="運に任せて飛び移る" target="*23"]
[s]
*10
「南に死者の王が眠る」と占い師は言った。[p]
[glink text="南を目指す" target="*15"]
[glink text="無視して北へ" target="*2"]
[glink text="もっと占いを聞く" target="*24"]
[s]
*11
情報屋が「聖なる遺物は遺跡にある」と言った。[p]
[glink text="遺跡の位置を聞く" target="*25"]
[glink text="金で詳細を買う" target="*26"]
[glink text="街を離れる" target="*13"]
[s]
*12
盗賊は君の財布を狙っていた！[p]
[glink text="反撃する" target="*27"]
[glink text="財布を渡す" target="*28"]
[glink text="逃げる" target="*14"]
[s]
*13
南の平原に出た。遠くに塔が見える。[p]
[glink text="塔を目指す" target="*29"]
[glink text="野営する" target="*30"]
[glink text="東へ向かう" target="*15"]
[s]
*14
村に戻ると村が襲われていた！[p]
[glink text="戦う" target="*18"]
[glink text="隠れる" target="*16"]
[glink text="長老を探す" target="*24"]
[s]
*15
君は平原を進み、怪しい霧に包まれた。[p]
[glink text="霧の中を突き進む" target="*29"]
[glink text="引き返す" target="*13"]
[glink text="高台に登って見渡す" target="*25"]
[s]
*16
背後には謎の影。目を合わせた瞬間、意識が…[p]
[glink text="気力で耐える" target="*30"]
[glink text="何者か叫ぶ" target="*24"]
[glink text="そのまま倒れる" target="*ending2"]
[s]
*17
獣を倒し、君は力を手に入れた。[p]
[glink text="力を試す" target="*19"]
[glink text="封印する" target="*20"]
[glink text="仲間に伝える" target="*5"]
[s]
*18
君は逃げのびたが、負傷した。[p]
[glink text="治療する" target="*21"]
[glink text="無理して進む" target="*29"]
[glink text="村へ戻る" target="*14"]
[s]
*19
魔法は成功したが、精神力を消耗した。[p]
[glink text="休む" target="*30"]
[glink text="急ぐ" target="*25"]
[glink text="仲間に頼る" target="*5"]
[s]
*20
紋章に触れると、記憶が蘇る。[p]
[glink text="過去を見る" target="*26"]
[glink text="封印を解く" target="*27"]
[glink text="逃げ出す" target="*21"]
[s]
*21
洞窟の奥で巨大な扉を発見した。[p]
[glink text="開ける" target="*29"]
[glink text="無視して進む" target="*30"]
[glink text="戻る" target="*13"]
[s]
*22
岩にしがみつき、何とか登った。[p]
[glink text="山頂を目指す" target="*25"]
[glink text="洞窟を探す" target="*8"]
[glink text="地図を確認する" target="*24"]
[s]
*23
飛び移った先に誰かがいた。[p]
[glink text="話しかける" target="*26"]
[glink text="無視して進む" target="*25"]
[glink text="戦う" target="*27"]
[s]
*24
「君には血が流れている」と長老が言った。[p]
[glink text="真実を受け入れる" target="*ending1"]
[glink text="逃げる" target="*ending2"]
[glink text="戦う運命を選ぶ" target="*ending3"]
[s]
*25
遺跡が現れた。君は扉を開く。[p]
[glink text="中へ入る" target="*29"]
[glink text="周囲を調べる" target="*30"]
[glink text="他の入口を探す" target="*26"]
[s]
*26
古代の書が光を放つ。[p]
[glink text="読む" target="*ending1"]
[glink text="破壊する" target="*ending2"]
[glink text="持ち帰る" target="*ending3"]
[s]
*27
封印された魔物が目を覚ました！[p]
[glink text="戦う" target="*ending3"]
[glink text="逃げる" target="*ending2"]
[glink text="封印し直す" target="*ending1"]
[s]
*28
君は盗賊に騙され、命を狙われた！[p]
[glink text="反撃する" target="*27"]
[glink text="許す" target="*24"]
[glink text="逃げる" target="*14"]
[s]
*29
塔の最上階に聖なる遺物が眠っていた。[p]
[glink text="手に取る" target="*ending1"]
[glink text="破壊する" target="*ending2"]
[glink text="守るために戦う" target="*ending3"]
[s]
*30
君は倒れ、夢の中で未来を見た。[p]
[glink text="希望の未来を選ぶ" target="*ending1"]
[glink text="破滅の未来に抗う" target="*ending2"]
[glink text="受け入れて眠る" target="*ending3"]
[s]

*ending1
君は聖なる遺物を手にし、世界を救った。[p]
その旅路は、伝説となって語り継がれるだろう。[p]
[glink text="最初に戻る" target="*1"]
[s]
*ending2
君は世界の終焉を止められなかった。[p]
だが、誰かが希望を受け継いでくれるだろう。[p]
[glink text="最初に戻る" target="*1"]
[s]
*ending3
君の選択は善悪を超えた道を切り開いた。[p]
それは第三の未来として、新たな物語を紡ぐ。[p]
[glink text="最初に戻る" target="*1"]
[s]

まぁ、作ってみたい気持ちはあるけど、むずかしいんでしょ？[p]
プログラミングとかやったことないし、、、[p]

[chara_mod name="akane" face="default"]

#あかね
そんな君に、耳寄りな情報があるんだけど[p]
ききたい？　ききたいよね？[p]
;second.ks というシナリオファイルの *start ラベルへ移動する
[jump storage=scene2.ks target=*start]


#
いや、べつに
#あかね
[cm]
[font size=40]
[delay speed=160]
ティラノスクリプトー[p]
[delay speed=30]
[resetfont]

#
・・・・[p]
#あかね
ティラノスクリプトを使うと、簡単に本格的なノベルゲームが簡単に作れてしまうのよ。[p]
#
へぇー。それはちょっと興味あるね。[p]

[chara_mod  name="akane" face="happy"  ]
#あかね
ほ、ほんと！？[p]
このゲームをプレイするだけで、ティラノスクリプトの機能を確認することができるから[p]
ぜひ、最後までつきあってね[p]

まず、ティラノスクリプトの特徴として[font color="red"]「HTML5」[resetfont]で動作するよ[p]


#
つ、つまり？[p]
#あかね
一度ティラノスクリプトで作ったゲームは多くの環境で動作させることができるってこと！[p]
#
へぇー。それはいいね。[p]
せっかく作ったらたくさんの人に遊んでもらいたいもんね。[p]

#あかね
ウィンドウズ用のPCアプリケーションはもちろん。[p]
マック用のアプリケーションにだって対応するわよ。[p]
あと、HTML5だから、ブラウザゲームとしても発表できるわよ。[p]
ウェブサイトに貼り付けて遊んでもらえるから、気軽にゲームをプレイしてもらうことができるね。[p]
主要なブラウザはすべてサポートしているから、安心してね。[p]
#
やるなぁ。。[p]

でも、最近スマホが復旧してて、僕のサイトにもスマホで訪れる人が増えたんだけど[p]
スマホからは遊べない？[p]

#あかね
ティラノスクリプトで作ったゲームはスマートフォンからでも遊べるよ！[p]
アイフォーン、アンドロイドはもちろん。アイパッドとかのタブレットでも問題ないわ。[p]
#
おぉー。[p]

#あかね
AppStoreやGooglePlayに向けてアプリ化して販売することもできるから[p]
#
おぉぉ、、やっとの貧困生活から脱出できるかも[p]
#あかね
まぁ、おもしろいゲームつくらないと、売れもしないけどな！[p]
#
くっ。。[p]

#あかね
じゃあ、次に場面を移動してみるね[p]
廊下に移動するよ[p]
[bg  time="3000"  method="crossfade" storage="rouka.jpg"  ]

#
お、廊下に移動したね。[p]

#あかね
寒いよぉ〜。はやく教室に戻ろう。[p]

[bg  time="1000" method="slide"  storage="room.jpg" ]
#
あれ、今、場面の移動がちょっと違ったね。[p]
#あかね
うん。急いでたからね。[p]
ティラノスクリプトでは、いろいろな演出を加える事ができて[p]
画面を切り替えるだけでも１０種類以上の演出がつかえるよ。[p]
#
ふむ。便利だ[p]

#あかね
次にメッセージの表示方法を変えてみるね[p]
ティラノスクリプトでは、今みたいなアドベンチャーゲームの他に[r]
ビジュアルノベルのような全画面表示のゲームもつくれるよ。[p]

#

;キャラクター非表示
[chara_hide name="akane"]


;メッセージを全画面に切り替え
[position layer="message0" left=20 top=40 width=1200 height=660 page=fore visible=true ]

どうかな? 物語をじっくり読ませたい場合はこの方式が便利ですね[l][r]
ティラノスクリプトは非常に強力で、柔軟な表現が可能です。[l][cm]

[font size=40]文字のサイズを変更したり
[l][r]
[resetfont]
[font color="pink"]色を変更したり
[resetfont][l][r]

[ruby text=る]ル[ruby text=び]ビを[ruby text=ふ]振ることだって[ruby text=かん]簡[ruby text=たん]単にできます[l]
[cm]

;たて書きにする
[position vertical=true layer=message0 page=fore margint="45" marginl="0" marginr="70" marginb="60"]

このように縦書きで記述することもできます。[r][l]
縦書きでも、横書きの時と同じ機能を使うことができます。[r][l]

;横書きに戻す
[position vertical=false]

横書きと縦書きをシーンによって使い分けることもできます[r][l]
じゃあ、アドベンチャー形式に戻しますね[p]

;メッセージボックスを元に戻す
[position layer="message0" left=160 top=500 width=1000 height=200 page=fore visible=true]

@chara_show name="akane"

#akane
メッセージボックスは、自分の好きな画像を使うこともできるよ[p]



[font color="0x454D51"]
[deffont color="0x454D51"]


;名前部分のメッセージレイヤ削除
[free name="chara_name_area" layer="message0"]

;メッセージウィンドウの設定
[position layer="message0" width="1280" height="210" top="510" left="0"]
[position layer="message0" frame="frame.png" margint="50" marginl="100" marginr="100" opacity="230" page="fore"]

;名前枠の設定
[ptext name="chara_name_area" layer="message0" color="0xFAFAFA" size="28" bold="true" x="100" y="514"]
[chara_config ptext="chara_name_area"]



どうかな？[p]
ゲームに合わせて自分の好きなデザインを作ってくださいね[p]

あと、デフォルトだとセーブやロードは画面右下のボタンからできるけど[p]
ウィンドウをカスタマイズすれば、、、、[p]

;メニューボタン非表示
@hidemenubutton

;ロールボタン追加;;;;;;;;;;;;;;


; ロールボタン配置

;クイックセーブボタン
[button name="role_button" role="quicksave" graphic="button/qsave.png" enterimg="button/qsave2.png" x="40" y="690"]

;クイックロードボタン
[button name="role_button" role="quickload" graphic="button/qload.png" enterimg="button/qload2.png" x="140" y="690"]

;セーブボタン
[button name="role_button" role="save" graphic="button/save.png" enterimg="button/save2.png" x="240" y="690"]

;ロードボタン
[button name="role_button" role="load" graphic="button/load.png" enterimg="button/load2.png" x="340" y="690"]

;オートボタン
[button name="role_button" role="auto" graphic="button/auto.png" enterimg="button/auto2.png" x="440" y="690"]

;スキップボタン
[button name="role_button" role="skip" graphic="button/skip.png" enterimg="button/skip2.png" x="540" y="690"]

;バックログボタン
[button name="role_button" role="backlog" graphic="button/log.png" enterimg="button/log2.png" x="640" y="690"]

;フルスクリーン切替ボタン
[button name="role_button" role="fullscreen" graphic="button/screen.png" enterimg="button/screen2.png" x="740" y="690"]

;コンフィグボタン（※sleepgame を使用して config.ks を呼び出しています）
[button name="role_button" role="sleepgame" graphic="button/sleep.png" enterimg="button/sleep2.png" storage="config.ks" x="840" y="690"]

;メニュー呼び出しボタン（※ロールボタンを使うなら不要）
[button name="role_button" role="menu" graphic="button/menu.png" enterimg="button/menu2.png" x="940" y="690"]

;メッセージウィンドウ非表示ボタン
[button name="role_button" role="window" graphic="button/close.png" enterimg="button/close2.png" x="1040" y="690"]

;タイトルに戻るボタン
[button name="role_button" role="title" graphic="button/title.png" enterimg="button/title2.png" x="1140" y="690"]

;;ロールボタン追加終わり


こんな風にゲームに必要な機能を画面の上に持たせることも簡単にできるよ[p]
これはロールボタンといって、ボタンに特別な機能を持たせる事ができます。[p]
標準で用意されているのは、[l]
セーブ、[l]
ロード、[l][cm]
タイトルへ戻る、
メニュー表示、
メッセージ非表示、
スキップ、
バックログ、
フルスクリーン切り替え、
クイックセーブ、
クイックロード、
オートモード！
[p]

はぁ、はぁ[p]

#
大丈夫？[p]
これだけあれば、ゲームを作るには困らなそうだね[p]

#あかね
さて、もちろん音楽を鳴らすこともできるよ[l][cm]
それじゃあ、再生するよ？[l][cm]

[link target=*playmusic]【１】うん。再生してください[endlink][r]
[link target=*noplay]【２】いや。今は再生しないで！[endlink]
[s]

*playmusic

[cm]
よし、再生するよ。[l]
@playbgm time="3000" storage=music.ogg loop=true
徐々にフェードインしながら再生することもできるんだ[l][cm]

@jump target="*common_bgm"

*noplay
[cm]
うん。わかった。再生はしないね。[l][cm]
また、試してみてね[l][cm]

*common_bgm

あ、そうそう[l][cm]
今みたいな選択肢で物語を分岐することも、簡単にできるよ。[l][cm]

#あかね
ここらで、別のキャラクターに登場してもらいましょうか[l][cm]
やまとー[p]
[chara_show name="yamato"]

こんな風に。簡単です。[l][r]
キャラクターは何人でも登場させることができるから、試してみてね。[p]

#yamato
おい、俺もう、帰っていいかな？[l][cm]

#akane
あ、ごめんごめん。ありがとう[l][cm]

[chara_hide name="yamato"]

#akane
これでティラノスクリプトの基本機能の説明は終わりだけど[p]
どうだったかな？[p]

#
うん、これなら自分でも作れそうな気がしてきたよ[p]

#あかね
よかった！[p]
最初は、ティラノスクリプト公式ページのチュートリアルをやってみると良いと思うよ！[p]
もちろん、このゲームもティラノスクリプトで動いてるから、参考になると思うし。[p]
ぜひ、ゲーム制作にチャレンジしてみてね[p]
プレイしてくれてありがとう。[p]

最後にティラノスクリプトで役立つ情報へのリンクを表示しておくから
確認してみてね。[p]

[cm]

*button_link

@layopt layer=message0 visible=false
@layopt layer=fix visible=false
[anim name="akane" left=600 time=1000]

;リンクボタンを表示
[glink text="ティラノビルダーの紹介" size=20 width=500 x=30 y=100 color=blue target=tyranobuilder ]
[glink text="制作事例" size=20 width=500 x=30 y=160 color=blue target=example ]
[glink text="応用テクニック" size=20 width=500 x=30 y=220 color=blue target=tech ]
[glink text="役に立つ情報源" size=20 width=500 x=30 y=280 color=blue target=info ]
[glink text="タグリファレンス" size=20 width=500 x=30 y=340 color=blue target=tagref ]

[s]

*tyranobuilder

[cm]
@layopt layer=message0 visible=true
@layopt layer=fix visible=true;
[font color-"red"]
「ティラノビルダー」
[resetfont]
という無料の開発ツールもあります。[p]

[image layer=1 page=fore visible=true top=10 left=50 width=560 height=400  storage = builder.png]

これは、グラフィカルな画面でノベルゲームを作れるツールです[p]
スクリプトが苦手な人でもゲーム制作を行うことができるからぜひ試してね。[p]
[freeimage layer=1]

@jump target=button_link

[s]
*example
@layopt layer=message0 visible=true
@layopt layer=fix visible=true
これまで、ティラノスクリプトを使って沢山のゲームが作成されています。[p]
一部の制作事例を公式サイトに乗せているのでよければ確認してくださいね。[p]

[iscript]
window.open("http://tyrano.jp/home/example");
[endscript]

@jump target=button_link

[cm]
[s]

*tech
@layopt layer=message0 visible=true
@layopt layer=fix visible=true
このサンプルでは、ティラノスクリプトのごく一部の機能しか紹介できていません[p]
さらに出来ることを知りたい場合、スクリプトを丸ごとダウンロードできるようになっているので[p]
そのサンプルを触ってみることをオススメします！[p]

[iscript]
window.open("http://tyrano.jp/home/demo");
[endscript]

@jump target=button_link


*info
@layopt layer=message0 visible=true
@layopt layer=fix visible=true
ティラノスクリプトでわからないことがあったら[p]
公式掲示板で質問したり、Wikiなどもありますので参考にしてみてください[p]
@jump target=button_link

*tagref
@layopt layer=message0 visible=true
@layopt layer=fix visible=true
タグは詳細なリファレンスページが用意されています。[p]
このページでさらに詳細な使い方を身につけてください[p]

[iscript]
window.open("http://tyrano.jp/home/tag");
[endscript]

@jump target="*button_link"

[s]



























































