import pool from '../DB/db-connect.js';

class Article {
  constructor(props) {
    this.articleType = props.articleType;
    this.articleDate = props.articleDate;
    this.previewImageUrl = props.previewImageUrl;
    this.previewImageAlt = props.previewImageAlt;
    this.author = props.author;
    this.tags = props.tags;
    this.views = props.views;
    this.h1 = props.h1;
    this.h1Paragraphs = props.h1Paragraphs;
    this.h2 = props.h2;
    this.h2Paragraphs = props.h2Paragraphs;
    this.h3 = props.h3;
    this.h3Paragraphs = props.h3Paragraphs;
    this.imageUrl = props.imageUrl;
    this.imageAlt = props.imageAlt;
    this.authorMedia = props.authorMedia;
  }
  async save() {
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
                 '${this.previewImageUrl}',
                 '${this.previewImageAlt}',
                 '${this.articleDate}',
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
                 '${this.imageUrl}',
                 '${this.imageAlt}',
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
    console.log('ADD ARTICLE RESULT', result);
    // if user was inserted return the created id, otherwise undefined
    return result.insertId ?? undefined;
  }

  static findAll() {}
}

export { Article };
