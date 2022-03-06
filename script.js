Vue.component('star-rating', VueStarRating.default);

let app = new Vue({
    el: '#app',
    data: {
      number: '',
      max: '',
      current: {
        title: '',
        img: '',
        alt: ''
      },
      loading: true,
      addedName: '',
      addedComment: '',
      comments: {},
      ratings:{},
    },
    created(){
      this.xkcd();
    },
    computed: {
        averageRating() {
          if(this.ratings[this.number] === undefined)
            return '';
          return(this.ratings[this.number].sum / this.ratings[this.number].total).toFixed(1);
        },
    },
    watch: {
        number(value, oldvalue) {
          if (oldvalue === '') {
            this.max = value;
          } else {
            this.xkcd();
          }
        },
      },
    created() {
      this.xkcd();
    },
    methods: {
        async xkcd() {
            try {
              this.loading = true;
              let url = 'https://xkcd.now.sh/?comic=';
              if (this.number === '') {
                url += 'latest';
              } else {
                url += this.number;
              }
              const response = await axios.get(url);
              this.current = response.data;
              this.loading = false;
              this.number = response.data.num;
            } catch (error) {
              console.log(error);
              this.number = this.max;
            }
        },
        previousComic() {
            this.number = this.current.num - 1;
            if (this.number < 1)
            this.number = 1;
          },
        nextComic() {
            this.number = this.current.num + 1;
            if (this.number > this.max)
            this.number = this.max
          },
        getRandom(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum and minimum are inclusive
          },
        randomComic() {
            this.number = this.getRandom(1, this.max);
          },
        firstComic(min){
            this.number = 1;
        },
        lastComic(max){
            this.number = this.max;
        },
        addComment() {
            if (!(this.number in this.comments))
              Vue.set(app.comments, this.number, new Array);
            this.comments[this.number].push({
              time: moment().format('MMMM Do YYYY, h:mm:ss a'),
              author: this.addedName,
              text: this.addedComment
            });
            this.addedName = '';
            this.addedComment = '';
        },
        setRating(rating){
            if(!(this.number in this.ratings))
              Vue.set(this.ratings, this.number, {
                sum:0,
                total: 0
              });
            this.ratings[this.number].sum += rating;
            this.ratings[this.number].total += 1;
        },
      },   
  });