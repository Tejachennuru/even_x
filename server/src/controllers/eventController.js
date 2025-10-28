const supabase = require('../config/supabase');

// Get all live events
exports.getAllEvents = async (req, res) => {
  try {
    const { date } = req.query;
    let query = supabase
      .from('events')
      .select('*')
      .eq('is_live', true)
      .order('start_time', { ascending: true });

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      query = query
        .gte('start_time', startOfDay.toISOString())
        .lte('start_time', endOfDay.toISOString());
    }

    const { data, error } = await query;

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single event by ID
exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .eq('is_live', true)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Event not found' });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all events for admin (including drafts)
exports.getAllEventsAdmin = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new event
exports.createEvent = async (req, res) => {
  try {
    const eventData = req.body;

    const { data, error } = await supabase
      .from('events')
      .insert([eventData])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update event
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const eventData = { ...req.body, updated_at: new Date().toISOString() };

    const { data, error } = await supabase
      .from('events')
      .update(eventData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Event not found' });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete event
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get stage schedule
exports.getStageSchedule = async (req, res) => {
  try {
    const { date } = req.query;
    let query = supabase
      .from('stage_schedule')
      .select('*')
      .order('time', { ascending: true });

    if (date) {
      query = query.eq('event_date', date);
    }

    const { data, error } = await query;

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Upload image to Supabase Storage
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      console.warn('Upload attempt with no file attached. Headers:', req.headers && req.headers['content-type']);
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.file;
    // sanitize filename to avoid spaces or unsafe characters in storage paths
    const safeOriginal = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    const fileName = `${Date.now()}-${safeOriginal}`;
    console.log('Uploading file to storage:', { fileName, size: file.size, mimetype: file.mimetype });

    const uploadResult = await supabase.storage
      .from('event-posters')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

    console.log('Supabase upload result:', uploadResult);

    if (uploadResult.error) {
      console.error('Supabase storage upload error:', uploadResult.error);
      return res.status(500).json({ error: uploadResult.error.message || 'Storage upload failed' });
    }

    // Get the public URL - ensure bucket is set to public in Supabase dashboard
    const { data: urlData } = supabase.storage
      .from('event-posters')
      .getPublicUrl(fileName);

    if (urlData && urlData.publicUrl) {
      console.log('Public URL:', urlData.publicUrl);
      return res.json({ url: urlData.publicUrl });
    }

    return res.status(500).json({ error: 'Failed to generate image url' });
  } catch (error) {
    console.error('Error in uploadImage:', error);
    res.status(500).json({ error: error.message });
  }
};