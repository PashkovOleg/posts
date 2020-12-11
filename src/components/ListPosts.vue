<template>
  <div data-app class="posts">
    <!-- For reusable you can create a DIALOG component -->
    <v-dialog
      v-model="dialog2"
      max-width="340"
    >
      <v-card>
        <v-card-title class="headline">
          {{ confirmText }}
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="closeRemove"
          >
            Cancel
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="agreeRemove"
          >
            Agree
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-data-table
      :headers="headers"
      :items="getFilteredPosts"
      :footer-props="{
        'items-per-page-options': [getFilteredPosts.length],
        'disable-items-per-page': true,
        'disable-pagination': true
      }"
      :items-per-page="getFilteredPosts.length"
      fixed-header
      :height="height"
    >
    <!-- Can also create a separate post component and configure routing like posts:id -->
      <template v-slot:top>
        <v-toolbar
          flat
        >
          <v-toolbar-title>POSTS</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-text-field
            class="search"
            label="Search"
            v-model="search"
            append-icon="mdi-magnify"
            filled
            rounded
            dense
          ></v-text-field>
          <v-spacer></v-spacer>  
          <v-dialog
            v-model="dialog"
            persistent
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                dark
                class="mb-2"
                v-bind="attrs"
                v-on="on"
              >
                New Post
              </v-btn>
            </template>
            <v-card ref="form">
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-text-field
                        small
                        v-model="editedPost.title"
                        label="Title"
                        filled
                        rounded
                        dense
                      ></v-text-field>
                    </v-col>
                    <v-col
                    >
                      <v-textarea
                        rows="2"
                        no-resize
                        small
                        v-model="editedPost.body"
                        label="Text"
                        filled
                        rounded
                        dense
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <div class="list-comments">
                <v-list two-line>
                  <template v-for="(item, index) in getCurrentPostComments(editedPost.id)">
                    <v-list-item :key="item.email">
                      <template>
                        <v-list-item-content>
                          <v-list-item-title v-text="item.email"></v-list-item-title>

                          <v-list-item-subtitle
                            class="text--primary"
                            v-text="item.name"
                          ></v-list-item-subtitle>

                          <v-list-item-subtitle v-text="item.body"></v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action>
                          <!-- I did not add the ability to edit comments, since the functionality is very similar to editing a post -->
                          <v-icon small class="mr-2" @click="removeComment(item)">
                            mdi-delete
                          </v-icon>
                        </v-list-item-action>
                      </template>
                    </v-list-item>

                    <v-divider
                      v-if="index < getCurrentPostComments(editedPost.id).length - 1"
                      :key="index"
                    ></v-divider>
                  </template>
                </v-list>
              </div>
              <v-card-text v-if="edit">
                <v-container>
                  <v-row>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-text-field
                        ref="nameComment"
                        small
                        v-model="nameComment"
                        :rules="[rules.required]"
                        label="Name"
                        filled
                        rounded
                        dense
                      ></v-text-field>
                    </v-col> 
                    <v-col
                      cols="12"
                      sm="8"
                      md="6"
                    >
                      <v-textarea
                        ref="bodyComment"
                        rows="2"
                        no-resize
                        small
                        v-model="bodyComment"
                        :rules="[rules.required]"
                        label="Body"
                        filled
                        rounded
                        dense
                      ></v-textarea>
                    </v-col>
                    <v-btn
                      color="primary"
                      dark
                      class="mb-2 comment-button"
                      @click="addComment"
                    >
                      Add comment
                    </v-btn>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="closePost"
                >
                  Close
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="savePost"
                >
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editPost(item)">
          mdi-pencil
        </v-icon>
        <v-icon small @click="removePost(item)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
  </div>
</template>
<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import { debounce } from 'lodash'
export default {
  name: 'ListPosts',
  components: {},
  data() {
    return {
      headers: [
        {
          text: 'ID',
          sortable: true,
          value: 'id',
          align: 'start',
          width: 20,
          divider: true
        },
        { text: 'UserId',
          sortable: false,
          value: 'userId',
          width: 20,
          divider: true
        },
        {
          text: 'Title',
          sortable: false,
          value: 'title',
          width: '30%',
          divider: true
        },
        { text: 'Text',
          sortable: false,
          value: 'body',
          width: '60%',
          divider: true
        },
        { text: 'Actions', value: 'actions', sortable: false, width: 20 }
      ],
      dialog: false,
      dialog2: false,
      edit: false,
      editedPost: {},
      defaultPost: {
        title: '',
        body: '',
        userId: process.env.VUE_APP_USER_ID || 666
      },
      search: '',
      height: '',
      comment: '',
      nameComment: '',
      bodyComment: '',
      remove: {},
      rules: {
        required: value => !!value || 'Required.'
      }
    }
  },
  created () {
    this.fetchPosts()
  },
  beforeMount () {
    window.addEventListener(
      'resize',
      debounce(() => this.calcHeight())
    )
  },
  mounted () {
    this.calcHeight()
  },
  computed: {
    ...mapGetters(['getCurrentPostComments']),
    ...mapState({
      listPosts: state => state.posts.posts,
      allComments: state => state.posts.allComments
    }),
    formTitle () {
      return this.edit ? 'Edit Post' : 'New Post' 
    },
    confirmText () {
      return this.remove.text
    },
    getFilteredPosts () {
      let posts = [...this.listPosts]
      let comments = [...this.allComments]
      if (this.search) {
        let string = this.search.toLowerCase()
        comments = comments.filter((data) => !string || data.name.toLowerCase().includes(string) || data.body.toLowerCase().includes(string))
        const postIds = comments.map(item => item.postId)
        const uniqueIds =  Array.from(new Set(postIds))
        posts = posts.filter((data) => !string || data.title.toLowerCase().includes(string) || data.body.toLowerCase().includes(string) || uniqueIds.includes(data.id))
      }
      return posts
    }
  },
  methods: {
    ...mapActions([
      'fetchPosts',
      'createPost',
      'changePost',
      'deletePost',
      'fetchPostComments',
      'createComment',
      'deleteComment'
    ]),
    calcHeight() {
      this.height = window.innerHeight - 105
    },
    addComment () {
      this.$refs['nameComment'].validate(true)
      this.$refs['bodyComment'].validate(true)
      if (this.$refs['nameComment'].valid && this.$refs['bodyComment'].valid) {
        const comment = {
          postId: this.editedPost.id,
          name: this.nameComment,
          body: this.bodyComment,
          email: process.env.VUE_APP_USER_EMAIL || 'test_post@gmail.com'
        }
        this.createComment(comment)
        this.clearComments()
      }
    },
    removeComment (comment) {
      this.remove = { method: 'deleteComment', id: comment.id, text: 'Are you sure you want to delete this comment?'}
      this.dialog2 = true
    },
    agreeRemove () {
      this[this.remove.method](this.remove.id)
      this.closeRemove()
    },
    closeRemove () {
      this.dialog2 = false
      this.remove = Object.assign({}, {})
    },
    editPost (post) {
      //For new posts api returns 500 error
      this.editedPost = Object.assign({}, post)
      this.fetchPostComments(post.id)
      this.edit = true
      this.dialog = true
    },
    removePost (post) {
      this.remove = { method: 'deletePost', id: post.id, text: 'Are you sure you want to delete this post?'}
      this.dialog2 = true
    },
    clearComments () {
      this.nameComment = ''
      this.bodyComment = ''
      this.$refs['nameComment'].reset()
      this.$refs['bodyComment'].reset()
    },
    closePost () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedPost = Object.assign({}, this.defaultPost)
        if (this.edit) {
          this.clearComments()
          this.edit = false
        }
      })
    },
    savePost () {
      if (this.edit) { 
        this.changePost(this.editedPost)
      } else {
        this.createPost(this.editedPost)
      }
      this.closePost()
    }
  },
  watch: {
    dialog (val) {
      if (!this.edit) {
        this.editedPost = Object.assign({}, this.defaultPost)
      }
      val || this.closePost()
    }
  }
}
</script>
<style lang="scss" scoped>
  .posts {
    width: 100%;
    height: 100%;
    .search {
      margin-top: 25px;
    }
    .comment-button {
      margin-top: 17px;
    }
    .container {
      padding-bottom: 0px;
      padding-top: 0px;
    }
    .v-list {
      padding: 0px 25px;
    }
    .list-comments {
      max-height: 240px;
      overflow: auto;
    }
    .row {
      &.center {
        align-items: center;
      }
    }
    .v-card__text, .v-card__title {
      padding-bottom: 0px !important;
    }
  }
</style>