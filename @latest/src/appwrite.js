import {Client, Databases, ID, Query} from "appwrite";
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
  //Pointing to the appwrite cloud server.
    .setProject(PROJECT_ID);

const database =
  new Databases(client);

/**
 * Updates the count of a search term in the database, or creates a new document if the search term does not exist.
created.
 */
export const updateSearchCount =
  async (searchTerm, movie) => {
    //1.Use Appwrite SDK to check if the search term Exists in the database
    try {
      const result =
        await database.listDocuments(DATABASE_ID, COLLECTION_ID, [Query.equal(
              "searchTerm",
              searchTerm
            ),
          ]);

      //2. If it doses, update a count

      if (result.documents.length > 0) {
        const doc = result.documents[0];
        await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
            count: doc.count +1,
        }
        )
      }
      //3. If it does, create a new document with the search term and a count of 1
      else {
        await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(),
          {
            //data
            searchTerm: searchTerm, count: 1, movie_id: movie.id,
            poster_url: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
          }
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

/**
 * Retrieves the top 10 trending movies from the database.
 *  - Resolves with an array of trending movie objects.
 *
 * The documents are sorted by the count in descending order (most trending first).
 * The list is limited to 10 documents.
 */
export const getTrendingMovies =async () => {
    try {
      const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID,[
            // Limit the list to 5 documents
            Query.limit(5),
            // Sort the documents by the count in descending order
            Query.orderDesc("count")
          ])
      return result.documents;
    } catch (error) {
      console.log(error);
    }
  };