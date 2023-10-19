import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';



export const apiSlice = createApi({
    reducerPath : "api",
    baseQuery : fetchBaseQuery({baseUrl : 'http://127.0.0.1:8000/api'}),
    tagTypes : ['Tag', 'User', 'CurrentUser', 'Doc'],
    endpoints : (builder) => ({
        getTags : builder.query<any, void>({
            query : () => '/tags',
            providesTags : (result = [], error, arg) => [
                'Tag',
                'Doc',
                ...result.map(({id} : any) => [{type : 'Tag', id}])
            ]
        }),
        getTag : builder.query<any, string>({
            query : (tagId) => `/tags/${tagId}`,
            providesTags : (result, error, arg) => [{type : 'Tag', id : arg}]
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
                url : `/tags/${tag.id}`,
                method : 'PUT',
                body : tag,
            }),
            invalidatesTags : (result, error, arg) => [{type : 'Tag', id : arg.id}]
        }),
        deleteTag : builder.mutation({
            query : (tagId) => ({
                url : `/tags/${tagId}`,
                method : "DELETE",
            }),
            invalidatesTags : ['Tag', 'Doc']
        }),
        getDocs : builder.query<any, void>({
            query : () => '/docs',
            providesTags : (result = [], error, arg) => [
                'Doc', 
                'Tag',
                ...result.map(({id} : any) => [{type : "Doc", id}])
            ]
        }),
        getDoc : builder.query<any, string>({
            query : (docId) => `/docs/${docId}`,
            providesTags : (result, error, arg) => [{type : 'Doc', id : arg}],
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
                url : `/docs/${doc.id}`,
                method : 'PUT',
                body : doc,
            }),
            invalidatesTags : (result, error, arg) => ['Doc', 'Tag', {type : 'Doc', id : arg.id}]
        }),
        deleteDoc : builder.mutation({
            query : (docId) => ({
                url : `/docs/${docId}`,
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
                url : "/auth",
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