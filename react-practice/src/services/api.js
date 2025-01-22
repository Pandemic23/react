import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'YOUR_SUPABASE_URL',
  'YOUR_SUPABASE_ANON_KEY'
)

export const blogApi = {
  // 게시글 관련 API
  async getPosts(page) {
    const from = page * 5
    const to = from + 4
    
    const { data, error, count } = await supabase
      .from('posts')
      .select('*', { count: 'exact' })
      .range(from, to)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    return {
      data: {
        content: data,
        totalPages: Math.ceil(count / 5)
      }
    }
  },

  createPost: (postData) => supabase.from('posts').insert(postData),
  
  // 프로필 관련 API
  getProfile: () => supabase.from('profiles').select('*'),

  async updateProfile(profile) {
    const { error } = await supabase
      .from('profiles')
      .upsert(profile)
    
    if (error) throw error
  },
  
  // 좋아요/싫어요 관련 API
  async updateReaction(postId, type) {
    const { error } = await supabase.rpc(
      type === 'LIKE' ? 'increment_likes' : 'increment_dislikes',
      { post_id: postId }
    )
    
    if (error) throw error
  }
}; 