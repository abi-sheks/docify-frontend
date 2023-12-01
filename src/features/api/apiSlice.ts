import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Tag, Doc } from '../../interfaces'
import { getCookie } from '../../utils';



// const authHeader = () => {
//     return {
//         XCSRFTOKEN : "csrfToken",
//     }
// }

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
         baseUrl: 'http://localhost:8000/api' ,
         credentials : "include",
         prepareHeaders : (headers : any) => {
            const csrfToken = getCookie("CSRF-TOKEN")
            console.log(csrfToken)
            headers.set('X-CSRFTOKEN', csrfToken)
            return headers
         },
        }),
    tagTypes: ['Tag', 'User', 'CurrentUser', 'Doc', 'DocSearch', 'Comment'],
    endpoints: (builder) => ({
        getTags: builder.query<any, any>({
            query: () => ({
                url: '/tags',
                // headers: authHeader()
            }),
            providesTags: (result = [], error, arg) => [
                'Tag',
                'Doc',
                ...result.map(({ id }: any) => [{ type: 'Tag', id }])
            ]
        }),
        getTag: builder.query<any, any>({
            query: ({ tagId  }: any) => ({
                url: `/tags/${tagId}`,
                // headers: authHeader(),
            }),
            providesTags: (result, error, arg) => [{ type: 'Tag', id: arg }]
        }),
        addNewTag: builder.mutation({
            query: ({ tag}: any) => ({
                url: '/tags/',
                method: 'POST',
                body: tag,
                // headers: authHeader()
            }),
            invalidatesTags: ['Tag'],
        }),
        editTag: builder.mutation({
            query: ({ tag }: any) => ({
                url: `/tags/${tag.id}`,
                method: 'PUT',
                body: tag,
                // headers: authHeader()
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Tag', id: arg.id }]
        }),
        deleteTag: builder.mutation({
            query: ({ tagId }: any) => ({
                url: `/tags/${tagId}`,
                method: "DELETE",
                // headers: authHeader()
            }),
            invalidatesTags: ['Tag', 'Doc']
        }),
        getDocs: builder.query<any, string>({
            query: () =>
            ({
                url: '/docs',
                // headers: authHeader()
            }),
            providesTags: (result = [], error, arg) => [
                'Doc',
                'Tag',
                ...result.map(({ id }: any) => [{ type: "Doc", id }])
            ]
        }),
        getDoc: builder.query<any, any>({
            query: ({ docId,  }: any) =>
            ({
                url: `/docs/${docId}`,
                // headers: authHeader()
            }),
            providesTags: (result, error, arg) => [{ type: 'Doc', id: arg }],
        }),
        addNewDoc: builder.mutation({
            query: ({ doc,  } : any) => ({
                url: '/docs/',
                method: "POST",
                body: doc,
                // headers: authHeader()
            }),
            invalidatesTags: ['Tag', 'Doc', 'DocSearch']
        }),
        editDoc: builder.mutation({
            query: ({doc}) => ({
                url: `/docs/${doc.id}`,
                method: 'PUT',
                body: doc,
                // headers: authHeader()
            }),
            invalidatesTags: (result, error, arg) => ['Doc', 'Tag', 'DocSearch', { type: 'Doc', id: arg.id }]
        }),
        deleteDoc: builder.mutation({
            query: ({docId}) => ({ 
                url: `/docs/${docId}`,
                method: 'DELETE',
                // headers: authHeader()
            }),
            invalidatesTags: ['Doc']
        }),
        getDocSearches: builder.query({
            query: ({ contenttext__contains,  }: any) => ({
                url: `/docs/search`,
                params: { contenttext__contains },
                // headers: authHeader()
            }),
            providesTags: ['DocSearch'],
        }),

        getUsers: builder.query<any, string>({
            query: () =>
            ({
                url: '/users',
                // headers: authHeader(),
            }),
            providesTags: ['User']
        }),
        getUser: builder.query<any, any>({
            query: ({userSlug, } : any) =>
            ({
                url: `/users/${userSlug}`,
                // headers : authHeader()
            })
        }),
        addNewUser: builder.mutation({
            query: (user) => ({
                url: '/auth/register/',
                method: "POST",
                body: user,
                headers: {
                    mode: 'no-cors',
                }
            }),
            invalidatesTags: ['User', 'Tag']
        }),
        getComments : builder.query<any, string>({
            query : () => 
            ({
                url : `/comments`,
                // headers : authHeader(),
            }),
            providesTags : ['Comment']
        }),
        addNewComment : builder.mutation({
            query : ({comment} : any) => ({
                url : '/comments/',
                method : 'POST',
                body : comment,
                // headers : authHeader(),
            }),
            invalidatesTags : ['Comment']
        })
    })
})

export const {
    useGetTagsQuery,
    useGetTagQuery,
    useAddNewTagMutation,
    useEditTagMutation,
    useDeleteTagMutation,

    useGetDocQuery,
    useGetDocsQuery,
    useAddNewDocMutation,
    useEditDocMutation,
    useDeleteDocMutation,

    useGetUserQuery,
    useGetUsersQuery,
    useAddNewUserMutation,

    useGetDocSearchesQuery,
    
    useGetCommentsQuery,
    useAddNewCommentMutation,
} = apiSlice;