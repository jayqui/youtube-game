require_relative "../app/models/search/YouTubeSearch"

describe "YouTubeSearch" do
  before(:all) do
    @yt = YouTubeSearch.new
    @sample_array = %w[six example words to choose from]
  end

  describe "#search_query" do
    before(:all) do
      @query_1 = @sample_array.sample(3)
      @result_1 = @yt.search_query(@query_1,3)
      @query_2 = @sample_array.sample(3)
      @result_2 = @yt.search_query(@query_2,3)
    end
    it "^ gets some results" do
      p @query_1
      p @result_1
      puts
      p @query_2
      p @result_2
      puts
    end
    it "returns an array of hashes" do
      expect(@result_1).to be_a(Array)
      expect(@result_2).to be_a(Array)
      expect(@result_1.map(&:class)).to eq([Hash, Hash, Hash])
      expect(@result_2.map(&:class)).to eq([Hash, Hash, Hash])
    end
    it 'with keys for title, url, and views' do
      expect(@result_1.map(&:keys)).to eq(Array.new(3,[:title, :url, :views]))
      expect(@result_2.map(&:keys)).to eq(Array.new(3,[:title, :url, :views]))
    end
    it "titles should all be strings" do
      expect(@result_1.map{|x| x[:title]}.map(&:class)).to eq(Array.new(3,String))
    end
    it "urls should all be https url strings" do
      @result_1.map{|x| x[:url]}.each do |url|
        expect(url).to start_with("https://www.youtube.com/")
      end
    end
    it "views should all be Fixnums" do
      expect(@result_1.map{|x| x[:views]}.map(&:class)).to eq(Array.new(3,Fixnum))
    end

  end


# # DEMO
# yt = YouTubeSearch.new
# p q = %w[six example words to choose from].sample(3)
# qa = yt.search_query(q,3).to_json
# puts JSON.parse(qa)

end