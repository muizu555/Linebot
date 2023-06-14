import {
  createData, deleteData, readData, updateData,
} from '../../crud.js';
import { error } from '../../log.js';
import { get } from '../../request.js';
// ユーザーのプロフィールを取得する関数
const getUserProfile = (event, client) => client.getProfile(event.source.userId);

// 受け取ったメッセージと返信するメッセージ(を返す関数)をマッピング
export const messageMap = {// keyがテキスト(ex.こんにちは)で関数(オブジェクト)が返る
  メモ: async (event, appContext) => {
    const memoData = await readData(event.source.userId, 'memo', appContext);
    if (memoData.Items[0]) {
      return {
        type: 'text',
        text: `メモには以下のメッセージが保存されています\n\n${memoData.Items[0].Data}`,
      };
    }

    return {
      type: 'text',
      text: 'メモが存在しません',
    };
  },
  メモ開始: async (event, appContext) => {
    await createData(event.source.userId, 'context', 'memoMode', appContext);
    return {
      type: 'text',
      text: 'メモモードを開始しました',
    };
  },

  天気予報: async () => {
    const weatherApiRes = (await get('https://www.jma.go.jp/bosai/forecast/data/forecast/070000.json')).data;
    console.log(weatherApiRes);
    // 返信するメッセージを作成
    return {
      type: 'text',
      text: `【天気予報】
    
    ${weatherApiRes[0].timeSeries[0].timeDefines[0]}: ${weatherApiRes[0].timeSeries[0].areas[2].weathers[0]}
    ${weatherApiRes[0].timeSeries[0].timeDefines[1]}: ${weatherApiRes[0].timeSeries[0].areas[2].weathers[1]}
    ${weatherApiRes[0].timeSeries[0].timeDefines[2]}: ${weatherApiRes[0].timeSeries[0].areas[2].weathers[2]} 
    `,
    };
  },

  Create: async (event, appContext) => {
    const date = new Date();
    await createData(event.source.userId, 'testData', `Data created at ${date}`, appContext);
    return {
      type: 'text',
      text: 'データが作成されました',
    };
  },
  Read: async (event, appContext) => {
    const dbData = await readData(event.source.userId, 'testData', appContext);
    return {
      type: 'text',
      text: `DBには以下のデータが保存されています\n\n${dbData.Items[0].Data}`,
    };
  },
  Update: async (event, appContext) => {
    const date = new Date();
    await updateData(event.source.userId, 'testData', `Data created at ${date}`, appContext);
    return {
      type: 'text',
      text: 'データを更新しました',
    };
  },
  Delete: async (event, appContext) => {
    await deleteData(event.source.userId, 'testData', appContext);
    return {
      type: 'text',
      text: 'データを削除しました',
    };
  },

  ニュース1: async () => {
    // ニュースAPIのレスポンスを格納する変数を宣言
    let newsApiRes;
    // エラーハンドリング
    try {
      // APIのレスポンスをnewsApiResに格納
      newsApiRes = (await get(`https://newsapi.org/v2/top-headlines?country=jp&apiKey=${process.env.NEWS_API_KEY}&pageSize=5`)).data;
    } catch (e) {
      error(`news API error: ${e}`);
      return {
        type: 'text',
        text: 'ニュースAPIのリクエストでエラーが発生しました',
      };
    }
    // 返信するメッセージの配列を用意
    const message = [];

    // newsApiRes.articlesを取り出す(分割代入という記法)
    const { articles } = newsApiRes;
    // articles(配列)の長さ分ループを回す
    // 配列の要素がarticleに格納される
    articles.forEach((article) => {
      // 配列にメッセージを追加
      message.push({
        type: 'text',
        text: `【画像URL】: ${article.urlToImage}\n【タイトル】: ${article.title}\n【公開日】: ${article.publishedAt}\n【概要】: ${article.description}\n【記事のURL】: ${article.url}\n【掲載元】: ${article.source.name}`,
      });
    });

    return message;
  },


  //後でフレックスメッセージについての演習もやること

  こんにちは: () => ({
    type: 'text',
    text: 'こんにちは世界',
  }),
  //追加
  おはよう: () => ({
    type: 'text',
    text: 'Good Morning!',
  }),
  Monday: () => ({
    type: 'text',
    text: '学校にいけ！',
  }),
  Tuesday: () => ({
    type: 'text',
    text: '学校にいけ！',
  }),
  Wednesday: () => ({
    type: 'text',
    text: '学校にいけ！',
  }),
  Thursday: () => ({
    type: 'text',
    text: '学校にいけ！',
  }),
  Friday: () => ({
    type: 'text',
    text: '学校にいけ！',
  }),


  複数メッセージ: () => ([
    {
      type: 'text',
      text: 'Hello, user',
    },
    {
      type: 'text',
      text: 'May I help you?',
    },
  ]),
  クイックリプライ: () => ({
    type: 'text',
    text: 'クイックリプライ（以下のアクションはクイックリプライ専用で、他のメッセージタイプでは使用できません）',
    quickReply: {
      items: [
        {
          type: 'action',
          action: {
            type: 'camera',
            label: 'カメラを開く',
          },
        },
        {
          type: 'action',
          action: {
            type: 'cameraRoll',
            label: 'カメラロールを開く',
          },
        },
        {
          type: 'action',
          action: {
            type: 'location',
            label: '位置情報画面を開く',
          },
        },
      ],
    },
  }),
  //追加
  予定: () => ({
    type: 'text',
    text: '何曜日の予定が知りたいですか？',
    quickReply: {
      items: [
        {
          type: 'action',
          action: {
            type: 'message',
            text: "Monday",
            label: '月曜日',
          },
        },
        {
          type: 'action',
          action: {
            type: 'message',
            text: "Tuesday",
            label: '火曜日',
          },
        },
        {
          type: 'action',
          action: {
            type: 'message',
            text: "Wednesday",
            label: '水曜日',
          },
        },
        {
          type: 'action',
          action: {
            type: 'message',
            text: "Thursday",
            label: '木曜日',
          },
        },
        {
          type: 'action',
          action: {
            type: 'message',
            text: "Friday",
            label: '金曜日',
          },
        },
      ],
    },
  }),
  スタンプメッセージ: () => ({
    type: 'sticker',
    packageId: '446',
    stickerId: '1988',
  }),
  画像メッセージ: () => ({
    type: 'image',
    originalContentUrl: 'https://shinbunbun.info/images/photos/7.jpeg',
    previewImageUrl: 'https://shinbunbun.info/images/photos/7.jpeg',
  }),
  音声メッセージ: () => ({
    type: 'audio',
    originalContentUrl:
      'https://github.com/shinbunbun/Hands-on-LINEBOT/blob/master/media/demo.m4a?raw=true',
    duration: 6000,
  }),
  動画メッセージ: () => ({
    type: 'video',
    originalContentUrl: 'https://github.com/shinbunbun/Hands-on-LINEBOT/blob/master/media/demo.mp4?raw=true',
    previewImageUrl: 'https://raw.githubusercontent.com/shinbunbun/Hands-on-LINEBOT/master/media/thumbnail.jpg?raw=true',
  }),
  位置情報メッセージ: () => ({
    type: 'location',
    title: 'my location',
    address: '〒160-0004 東京都新宿区四谷一丁目6番1号',
    latitude: 35.687574,
    longitude: 139.72922,
  }),
  イメージマップメッセージ: () => ([
    {
      type: 'imagemap',
      baseUrl:
        'https://github.com/shinbunbun/Hands-on-LINEBOT/blob/master/media/imagemap.png?raw=true',
      altText: 'This is an imagemap',
      baseSize: {
        width: 1686,
        height: 948,
      },
      actions: [
        {
          type: 'uri',
          area: {
            x: 590,
            y: 179,
            width: 511,
            height: 585,
          },
          linkUri: 'https://shinbunbun.info/about/',
        },
        {
          type: 'message',
          area: {
            x: 0,
            y: 0,
            width: 458,
            height: 948,
          },
          text: 'しんぶんぶん！！！',
        },
        {
          type: 'message',
          area: {
            x: 1230,
            y: 0,
            width: 456,
            height: 948,
          },
          text: 'しんぶんぶん！！！',
        },
      ],
    },
    {
      type: 'text',
      text: '画像の色々なところをタップしてみよう！',
    },
  ]),
  ボタンテンプレート: () => ({
    type: 'template',
    altText: 'ボタンテンプレート',
    template: {
      type: 'buttons',
      thumbnailImageUrl: 'https://shinbunbun.info/images/photos/7.jpeg',
      imageAspectRatio: 'rectangle',
      imageSize: 'cover',
      imageBackgroundColor: '#FFFFFF',
      title: 'ボタンテンプレート',
      text: 'ボタンだお',
      defaultAction: {
        type: 'uri',
        label: 'View detail',
        uri: 'https://shinbunbun.info/images/photos/',
      },
      actions: [
        {
          type: 'postback',
          label: 'ポストバックアクション',
          data: 'button-postback',
        },
        {
          type: 'message',
          label: 'メッセージアクション',
          text: 'button-message',
        },
        {
          type: 'uri',
          label: 'URIアクション',
          uri: 'https://shinbunbun.info/',
        },
        {
          type: 'datetimepicker',
          label: '日時選択アクション',
          data: 'button-date',
          mode: 'datetime',
          initial: '2021-06-01t00:00',
          max: '2022-12-31t23:59',
          min: '2021-06-01t00:00',
        },
      ],
    },
  }),
  確認テンプレート: () => ({
    type: 'template',
    altText: '確認テンプレート',
    template: {
      type: 'confirm',
      text: '確認テンプレート',
      actions: [
        {
          type: 'message',
          label: 'はい',
          text: 'yes',
        },
        {
          type: 'message',
          label: 'いいえ',
          text: 'no',
        },
      ],
    },
  }),
  カルーセルテンプレート: () => ({
    type: 'template',
    altText: 'カルーセルテンプレート',
    template: {
      type: 'carousel',
      columns: [
        {
          thumbnailImageUrl: 'https://shinbunbun.info/images/photos/7.jpeg',
          imageBackgroundColor: '#FFFFFF',
          title: 'タイトル1',
          text: '説明1',
          defaultAction: {
            type: 'uri',
            label: 'View detail',
            uri: 'https://shinbunbun.info/',
          },
          actions: [
            {
              type: 'postback',
              label: 'ポストバック',
              data: 'postback-carousel-1',
            },
            {
              type: 'uri',
              label: 'URIアクション',
              uri: 'https://shinbunbun.info/',
            },
          ],
        },
        {
          thumbnailImageUrl:
            'https://shinbunbun.info/images/photos/10.jpeg',
          imageBackgroundColor: '#FFFFFF',
          title: 'タイトル2',
          text: '説明2',
          defaultAction: {
            type: 'uri',
            label: 'View detail',
            uri: 'https://shinbunbun.info/',
          },
          actions: [
            {
              type: 'postback',
              label: 'ポストバック',
              data: 'postback-carousel-2',
            },
            {
              type: 'uri',
              label: 'URIアクション',
              uri: 'https://shinbunbun.info/',
            },
          ],
        },
      ],
      imageAspectRatio: 'rectangle',
      imageSize: 'cover',
    },
  }),
  画像カルーセルテンプレート: () => ({
    type: 'template',
    altText: '画像カルーセルテンプレート',
    template: {
      type: 'image_carousel',
      columns: [
        {
          imageUrl: 'https://shinbunbun.info/images/photos/4.jpeg',
          action: {
            type: 'postback',
            label: 'ポストバック',
            data: 'image-carousel-1',
          },
        },
        {
          imageUrl: 'https://shinbunbun.info/images/photos/5.jpeg',
          action: {
            type: 'message',
            label: 'メッセージ',
            text: 'いえい',
          },
        },
        {
          imageUrl: 'https://shinbunbun.info/images/photos/7.jpeg',
          action: {
            type: 'uri',
            label: 'URIアクション',
            uri: 'https://shinbunbun.info/',
          },
        },
      ],
    },
  }),
  'Flex Message': () => ({
    type: 'flex',
    altText: 'Flex Message',
    contents: {
      type: 'bubble',
      header: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: 'Flex Message',
            color: '#FFFFFF',
            weight: 'bold',
          },
        ],
      },
      hero: {
        type: 'image',
        url: 'https://pbs.twimg.com/profile_images/1236928986212478976/wDa51i9T_400x400.jpg',
        size: 'xl',
      },
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: 'しんぶんぶん',
            size: 'xl',
            weight: 'bold',
            align: 'center',
          },
          {
            type: 'text',
            text: '会津大学学部二年',
            align: 'center',
          },
          {
            type: 'separator',
            margin: 'md',
          },
          {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'button',
                action: {
                  type: 'uri',
                  label: 'ホームページ',
                  uri: 'https://shinbunbun.info/',
                },
                style: 'primary',
                offsetBottom: '10px',
              },
              {
                type: 'button',
                action: {
                  type: 'uri',
                  label: 'Twitter',
                  uri: 'https://twitter.com/shinbunbun_',
                },
                style: 'primary',
                color: '#1DA1F2',
              },
            ],
            paddingTop: '10px',
          },
        ],
      },
      styles: {
        header: {
          backgroundColor: '#008282',
        },
      },
    },
  }),
  プロフィール: async (event, appContext) => {
    // ユーザーのプロフィール情報を取得
    const profile = await getUserProfile(event, appContext.lineClient);
    // 返信するメッセージを作成
    return {
      type: 'text',
      text: `あなたの名前: ${profile.displayName}\nユーザーID: ${profile.userId}\nプロフィール画像のURL: ${profile.pictureUrl}\nステータスメッセージ: ${profile.statusMessage}`,
    };
  },
  ここはどこ: (event) => ({
    type: 'text',
    text: `ここは${event.source.type}だよ！`,
  }),
};
