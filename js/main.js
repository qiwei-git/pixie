const app = new Vue({
    el: '#app',
    data() {
        return {
            expire_step: 3 * 60 * 1000,
            hitokoto: {
                key: 'HITOKOTO_PROPS',
                content: 'XXXXXXXXXXXXXXXXXXXXX',
                expire: 0,
                from: null,
                from_who: null,
            },            
        }
    },
    computed: {
        fromLabel() {
            if (this.hitokoto.from && this.hitokoto.from_who) {
                return `${this.hitokoto.from} / ${this.hitokoto.from_who}`;
            }
            return this.hitokoto.from ? this.hitokoto.from : this.hitokoto.from_who
        },
    },
    mounted() {
        let hitokoto = localStorage.getItem(this.hitokoto.key);
        if (hitokoto) {
            try {
                hitokoto = JSON.parse(hitokoto);
            } catch (err) {
                console.error(err, hitokoto);
                hitokoto = null;
            }
        }
        if (
            !hitokoto 
            || !hitokoto.content 
            || !hitokoto.expire 
            || hitokoto.expire <= new Date().getTime() - this.expire_step
        ) {
            axios.get('https://v1.hitokoto.cn/?c=a&c=b&c=l')
            .then((resp) => {
                let data = resp.data;
                let hitokoto = {
                    expire: new Date().getTime(),
                    content: data.hitokoto,
                    from: data.from,
                    from_who: data.from_who,
                }
                console.log(this)
                this.hitokoto.expire = hitokoto.expire;
                this.hitokoto.content = hitokoto.content;
                this.hitokoto.from = hitokoto.from;
                this.hitokoto.from_who = hitokoto.from_who;
                localStorage.setItem(this.hitokoto.key, JSON.stringify(hitokoto));
            })
        } else {
            this.hitokoto.expire = hitokoto.expire;
            this.hitokoto.content = hitokoto.content;
            this.hitokoto.from = hitokoto.from;
            this.hitokoto.from_who = hitokoto.from_who;
        }
        
    },
})