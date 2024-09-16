import pool from '../DB/db-connect.js';

class Article {
  constructor(props = {}) {
    this.articleType = props.articleType || 'image';
    this.date = props.date || new Date();
    this.previewImageURL = props.previewImageURL || '';
    this.previewImageAlt = props.previewImageAlt || '';
    this.author = props.author || '';
    this.tags = props.tags || [];
    this.views = props.views || 0;
    this.h1 = props.h1 || '';
    this.h1Paragraphs = props.h1Paragraphs || [];
    this.h2 = props.h2 || '';
    this.h2Paragraphs = props.h2Paragraphs || [];
    this.h3 = props.h3 || '';
    this.h3Paragraphs = props.h3Paragraphs || [];
    this.articleImageURL = props.articleImageURL || '';
    this.articleImageAlt = props.articleImageAlt || '';
    this.authorMedia = props.authorMedia || [];
  }

  async getNextPK() {
    const sql = `SELECT AUTO_INCREMENT
                FROM information_schema.tables
                WHERE table_schema = '${process.env.SQL_DB_NAME}'
                AND table_name = 'news';`;
    const [result, _] = await pool.execute(sql);

    return result[0].AUTO_INCREMENT || 0;
  }

  async save() {
    try {
      let sql = `
              INSERT INTO news(
                  article_type,
                  preview_image_url,
                  preview_image_alt,
                  article_date,
                  views,
                  h1,
                  h1p1_text,
                  h1p1_type,
                  h1p2_text,
                  h1p2_type,
                  h1p3_text,
                  h1p3_type,
                  h2,
                  h2p1_text,
                  h2p1_type,
                  h2p2_text,
                  h2p2_type,
                  h2p3_text,
                  h2p3_type,
                  h3,
                  h3p1_text,
                  h3p1_type,
                  h3p2_text,
                  h3p2_type,
                  h3p3_text,
                  h3p3_type,
                  image_url,
                  image_alt,
                  author_media_url1,
                  author_media_type1,
                  author_media_url2,
                  author_media_type2,
                  tag1,
                  tag2,
                  tag3,
                  tag4,
                  author)
                  VALUES(
                   '${this.articleType}',
                   '${this.previewImageURL}',
                   '${this.previewImageAlt}',
                   '${this.date}',
                   '${this.views}',
                   '${this.h1}',
                   '${this.h1Paragraphs[0].text}',
                   '${this.h1Paragraphs[0].role}',
                   '${this.h1Paragraphs[1].text}',
                   '${this.h1Paragraphs[1].role}',
                   '${this.h1Paragraphs[2].text}',
                   '${this.h1Paragraphs[2].role}',
                   '${this.h2}',
                   '${this.h2Paragraphs[0].text}',
                   '${this.h2Paragraphs[0].role}',
                   '${this.h2Paragraphs[1].text}',
                   '${this.h2Paragraphs[1].role}',
                   '${this.h2Paragraphs[2].text}',
                   '${this.h2Paragraphs[2].role}',
                   '${this.h3}',
                   '${this.h3Paragraphs[0].text}',
                   '${this.h3Paragraphs[0].role}',
                   '${this.h3Paragraphs[1].text}',
                   '${this.h3Paragraphs[1].role}',
                   '${this.h3Paragraphs[2].text}',
                   '${this.h3Paragraphs[2].role}',
                   '${this.articleImageURL}',
                   '${this.articleImageAlt}',
                   '${this.authorMedia[0].url}',
                   '${this.authorMedia[0].type}',
                   '${this.authorMedia[1].url}',
                   '${this.authorMedia[1].type}',
                   '${this.tags[0]}',
                   '${this.tags[1]}',
                   '${this.tags[2]}',
                   '${this.tags[3]}',
                   '${this.author}');`;

      const [result, _] = await pool.execute(sql);

      // if user was inserted return the created id, otherwise undefined
      return result.insertId ?? undefined;
    } catch (err) {
      console.warn('Error saving article to data base' + err);
    }
  }

  async fetch() {
    // TODO add try catch here to log sql errors
    const sql = `SELECT * FROM news`;
    const [result, _] = await pool.execute(sql);

    const parsedData = this.#convertFromSqlToFront(result);
    return parsedData;
  }

  async getOneArticle(newsId) {
    let sql = `SELECT * FROM news WHERE id = ${newsId}`;
    const [result, _] = await pool.execute(sql);

    const parsedData = this.#convertFromSqlToFront(result);

    return parsedData;
  }

  // helper method to convert article data coming from sql
  // to IArticle data used in fron-end
  #convertFromSqlToFront(array) {
    let resultArray = [];

    array.forEach((article) => {
      const parsedArticle = {
        itemId: article.id,
        articleType: article.article_type,
        previewImageURL: article.preview_image_url,
        previewImageAlt: article.preview_image_alt,
        date: article.article_date,
        views: article.views,
        h1: article.h1,
        h1Paragraphs: [
          { role: article.h1p1_type, text: article.h1p1_text },
          { role: article.h1p2_type, text: article.h1p2_text },
          { role: article.h1p3_type, text: article.h1p3_text },
        ],
        h2: article.h2,
        h2Paragraphs: [
          { role: article.h2p1_type, text: article.h2p1_text },
          { role: article.h2p2_type, text: article.h2p2_text },
          { role: article.h2p3_type, text: article.h2p3_text },
        ],
        h3: article.h3,
        h3Paragraphs: [
          { role: article.h3p1_type, text: article.h3p1_text },
          { role: article.h3p2_type, text: article.h3p2_text },
          { role: article.h3p3_type, text: article.h3p3_text },
        ],
        articleImageURL: article.image_url,
        articleImageAlt: article.image_alt,
        author: article.author,
        authorMedia: [
          { type: article.author_media_type1, url: article.author_media_url1 },
          { type: article.author_media_type2, url: article.author_media_url2 },
        ],
        tags: [article.tag1, article.tag2, article.tag3, article.tag4],
      };
      resultArray.push(parsedArticle);
    });
    return resultArray;
  }
}

export { Article };
