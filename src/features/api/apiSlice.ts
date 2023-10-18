import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';



export const apiSlice = createApi({
    reducerPath : "api",
    baseQuery : fetchBaseQuery({baseUrl : 'http://127.0.0.1:8000/search'}),
    tagTypes : ['Tag', 'User', 'CurrentUser', 'Doc'],
    endpoints : (builder) => ({
        getTags : builder.query<any, void>({
            query : () => '/tags',
            providesTags : (result = [], error, arg) => [
                'Tag',
                'Doc',
                ...result.map(({slug} : any) => [{type : 'Tag', slug}])
            ]
        }),
        getTag : builder.query<any, string>({
            query : (tagSlug) => `/tags/${tagSlug}`,
            providesTags : (result, error, arg) => [{type : 'Tag', slug : arg}]
        }),
        addNewTag : builder.mutation({
            query : (tag) => ({
                url : '/tags/',
                method : 'POST',
                body : tag,
            }),
            invalidatesTags : ['Tag'],
        }),
        editTag : builder.mutation({
            query : (tag) => ({
                url : `/tags/${tag.slug}`,
                method : 'PUT',
                body : tag,
            }),
            invalidatesTags : (result, error, arg) => [{type : 'Tag', slug : arg.slug}]
        }),
        deleteTag : builder.mutation({
            query : (tagSlug) => ({
                url : `/tags/${tagSlug}`,
                method : "DELETE",
            }),
            invalidatesTags : ['Tag', 'Doc']
        }),
        getDocs : builder.query<any, void>({
            query : () => '/docs',
            providesTags : (result = [], error, arg) => [
                'Doc', 
                'Tag',
                ...result.map(({slug} : any) => [{type : "Doc", slug}])
            ]
        }),
        getDoc : builder.query<any, string>({
            query : (docId) => `/docs/${docId}`,
            providesTags : (result, error, arg) => [{type : 'Doc', slug : arg}],
        }),
        addNewDoc : builder.mutation({
            query : (doc) => ({
                url : '/docs/',
                method : "POST",
                body : doc,
            }),
            invalidatesTags : ['Tag', 'Doc']
        }),
        editDoc : builder.mutation({
            query : (doc) => ({
                url : `/docs/${doc.slug}`,
                method : 'PUT',
                body : doc,
            }),
            invalidatesTags : (result, error, arg) => ['Doc', 'Tag', {type : 'Doc', slug : arg.slug}]
        }),
        deleteDoc : builder.mutation({
            query : (docSlug) => ({
                url : `/docs/${docSlug}`,
                method : 'DELETE',
            }),
            invalidatesTags : ['Doc']
        }),

        getUsers : builder.query<any, void>({
            query : () => '/users',
            providesTags : ['User']
        }),
        getUser : builder.query<any, string>({
            query : (userSlug) => `/users/${userSlug}`,
        }),
        addNewUser : builder.mutation({
            query : (user) => ({
                url : '/users/',
                method : "POST",
                body : user,
            }),
            invalidatesTags : ['User', 'Tag']
        }),
        getCurrentUser : builder.query<any, string>({
            query : () => ({
                url : "https://channeli.in/oauth/authorise?client_id=CLIENT_ID",
            })
        }),
    })
})

export const { 
    useGetTagsQuery, 
    useGetTagQuery, 
    useAddNewTagMutation,
    useGetDocQuery,
    useGetDocsQuery,
    useAddNewDocMutation,
    useGetCurrentUserQuery,
    useGetUserQuery,
    useGetUsersQuery,
    useAddNewUserMutation,
    useEditTagMutation,
    useEditDocMutation,
    useDeleteDocMutation,
    useDeleteTagMutation,
 } = apiSlice;