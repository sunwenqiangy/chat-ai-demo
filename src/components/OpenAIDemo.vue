<template>
  <div class="OpenAIDemo-wrap dark">
    <!-- 聊天记录区 -->
    <el-row class="history-list-row" justify="center">
      <el-col :span="12">
        <span class="header-title-text">聊天记录：</span>
        <div v-if="isHasMessage" class="message-list-wrap">
          <div v-for="(item, index) in messageList" :key="index" class="message-list-item">
            <el-icon v-if="item.role === 'system'" :size="20">
              <Setting />
            </el-icon>
            <el-icon v-else-if="item.role === 'user'" :size="20">
              <User />
            </el-icon>
            <el-icon v-else-if="item.role === 'assistant'" :size="20" color="#409efc">
              <Printer />
            </el-icon>
            <p>
              {{ item.content }}
            </p>
          </div>
          <div v-show="isLoading" class="message-list-item">
            <el-icon :size="20" color="#409efc">
              <Printer />
            </el-icon>
            <p>思考中······</p>
          </div>
        </div>

        <div v-else class="message-list-wrap">
          还没有历史记录，快去搜索哦～～～
        </div>
      </el-col>
    </el-row>

    <!-- 输入内容区 -->
    <el-row class="input-row" justify="center">
      <el-col :span="12">
        <el-form label-width="auto">
          <span class="header-title-text">ApiKey：</span>
          <el-form-item label="" style="margin-top:10px">
            <el-input v-model="api_key" placeholder="请输入秘钥" show-password type="password"></el-input>
          </el-form-item>
          <template v-if="!isHasMessage">
            <el-form-item>
              <div v-if="isShowSystemRoleRule" style="width: 100%">
                <span class="header-title-text"> 系统角色：</span>
                <span class="header-desc-text margin-bottom-10">给模型定下一些规则，设定助手的行为。</span>
                <el-input type="textarea" v-model="systemRoleContent.content"
                  placeholder="请输入～" rows="2"
                  class="margin-bottom-10 input-text"></el-input>
                <el-button type="success" @click="addSystemRole">设置</el-button>
                <el-button @click="isShowSystemRoleRule = false">取消</el-button>
              </div>
  
              <template v-else >
                <el-tooltip effect="dark" content="添加系统消息，有助于设置助手的行为" placement="bottom">
                  <el-button type="success" @click="isShowSystemRoleRule = true">添加系统角色</el-button>
                </el-tooltip>
              </template>
            </el-form-item>
          </template>

          <el-form-item>
            <el-input type="textarea" v-model="inputText" :disabled="isShowSystemRoleRule"
              placeholder="请输入查询内容" rows="2" class="input-text"></el-input>
          </el-form-item>
          <div>
            <el-button color="#626aef" :disabled="isShowSystemRoleRule" @click="queryMessage"
            >查询</el-button>
            <el-tooltip effect="dark" content="delete(刪除所有）" placement="top">
              <el-popconfirm width="220" confirm-button-text="确定" cancel-button-text="取消"
                icon-color="#626AEF" title="确定要删除所有记录吗？" @confirm="deleteAll">
                <template #reference>
                  <el-button type="warning" icon="Delete"></el-button>
                </template>
              </el-popconfirm>
            </el-tooltip>
          </div>
        </el-form>
      </el-col>
    </el-row>

    <el-row  justify="center" v-if="outputText">
      <el-col :span="12">
        <span class="header-title-text">输出： </span>
        <p class="header-desc-text">{{ outputText }}</p>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// const { Configuration, OpenAIApi } = require("openai");
// import { Configuration, OpenAIApi } from 'openai'
import { ElMessage } from 'element-plus'
import chatAPI from '/src/api/chatAPI.js'


export default {
  name: "OpenAIDemo",
  data() {
    return {
      api_key: "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", // API密钥
      systemRoleContent: {
        role: "system",
        content: "",
      },
      isShowSystemRoleRule: false,
      isLoading: false,
      inputText: "",
      outputText: "",
      messageList: [
        // {"role": "system", "content": "你是一个AI机器人助手。"},
        // {"role": "user", "content": "你是？"},
        // {"role": "assistant", "content": "我是一个AI机器人助手。"},
        // {"role": "user", "content": "你能做什么？"},
        // {"role": "assistant", "content": "我可以回答你的问题、提供信息、执行任务、提供建议、进行翻译、进行语音识别和语音合成等。如果你有需要，我还可以与你进行聊天和交流。"},
      ],
    };
  },
  computed: {
    isHasMessage() {
      return this.messageList.length > 0
    }
  },
  methods: {
    setParamsData() {
      this.messageList.push({
        role: "user",
        content: this.inputText,
      });
      return {
        model: "gpt-3.5-turbo",
        messages: this.messageList,
        max_tokens: 100,
      }
    },
    async queryMessage() {
      try {
        if (!this.inputText) return;
        
        const params = this.setParamsData()
        console.log('params', params);
        this.inputText = '';
        this.isLoading = true;

        const response = await chatAPI({
          apiKey: this.api_key,
          messages: params.messages
        });

      const data = await response.json();
      console.log('data>>>', data);
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

        // const configuration = new Configuration({
        //   apiKey: this.api_key,
        // });
        // const openAi = new OpenAIApi(configuration);
        // const response = await openAi.createChatCompletion(params);

        // console.log("response>>>", response);

        // if (response.status === 200) {
        //   const data = response.data.choices[0];
        //   this.messageList.push(data.message);
        //   this.outputText = data.message.content;
        // }
        console.log("this.messageList>>>", this.messageList);
        this.isLoading = false;
      } catch (error) {
        console.log("3>>>>", error);
        ElMessage.error(error)
        this.isLoading = false;
      }
    },
    addSystemRole() {
      if (!this.systemRoleContent.content) {
        ElMessage({
          message: '请输入系统角色规则内容',
          type: 'warning',
        })
        return
      }
      this.messageList.push(this.systemRoleContent);
      this.isShowSystemRoleRule = false;
    },
    deleteAll() {
      this.inputText = '';
      this.outputText = '';
      this.messageList = [];
    },
  },
};
</script>

<style scoped>
.message-list-wrap {
  margin: 10px 0 20px;
  padding: 20px;
  width: 100%;
  border: 2px solid #ccc;
}

.message-list-item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.message-list-item > p {
  margin: 10px;
}

.header-title-text {
  font-size: 16px;
  line-height: 24px;
  font-weight: bolder;
}

.header-desc-text {
  display: block;
  font-size: 14px;
  line-height: 20px;
  color: #333;
}

.margin-bottom-10 {
  margin-bottom: 10px;
}

.margin-left-10 {
  margin-left: 10px;
}

.input-text {
  font-size: 16px;
}
</style>
