import mongoose from 'mongoose'

const homeStatsSchema = new mongoose.Schema({
  years: { type: String, required: true, default: '24' },
  teachers: { type: String, required: true, default: '29' },
  students: { type: String, required: true, default: '1500' }
}, { timestamps: true })

// Ensure only one document exists
homeStatsSchema.statics.getStats = async function() {
  let stats = await this.findOne()
  if (!stats) {
    stats = await this.create({ years: '24', teachers: '29', students: '1500' })
  }
  return stats
}

const HomeStats = mongoose.model('HomeStats', homeStatsSchema)

export default HomeStats

